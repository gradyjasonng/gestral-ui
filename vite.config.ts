/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { generateTokensCss } from './src/lib/generateTokensCss';
import { generateTextSourceCss } from './src/lib/generateTextSourceCss';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const GENERATED_CSS_PATH = resolve(dirname, 'src/styles/generated.css');
const TOKENS_CSS_PATH = resolve(dirname, 'src/styles/tokens.css');
const WATCHED_SCALE_FILES = [
  resolve(dirname, 'src/lib/textScale.ts'),
  resolve(dirname, 'src/lib/radiusScale.ts'),
  resolve(dirname, 'src/lib/spacingScale.ts'),
  TOKENS_CSS_PATH,
];

function writeGeneratedCss() {
  const handAuthoredTokensCss = readFileSync(TOKENS_CSS_PATH, 'utf-8');
  const css = generateTokensCss(handAuthoredTokensCss) + '\n' + generateTextSourceCss();
  // generated.css is part of the module graph (tokens.css @imports it), so
  // under `vite build --watch` an unconditional write here re-triggers the
  // watcher on every build, which re-runs buildStart, which writes again —
  // an infinite rebuild loop. Only write when the content actually changed.
  if (existsSync(GENERATED_CSS_PATH) && readFileSync(GENERATED_CSS_PATH, 'utf-8') === css) {
    return;
  }
  writeFileSync(GENERATED_CSS_PATH, css);
}

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [tailwindcss(), react(), dts({
    include: ['src'],
    exclude: ['src/**/*.stories.tsx'],
  }), {
    name: 'generate-tokens-css',
    // Unlike generate-theme-css below (closeBundle-only, production build
    // only), this must also run for `storybook dev`/`vite dev` — Storybook
    // loads tokens.css live, so the generated file needs to exist before
    // Tailwind's CSS pipeline first reads it, and stay fresh across an
    // active dev session (including when tokens.css's own hand-authored
    // colors/fonts/icon-size change, since generated.css mirrors those too).
    buildStart() {
      writeGeneratedCss();
    },
    configureServer(server) {
      writeGeneratedCss();
      for (const file of WATCHED_SCALE_FILES) {
        server.watcher.add(file);
      }
      server.watcher.on('change', (file) => {
        if (WATCHED_SCALE_FILES.includes(file)) {
          writeGeneratedCss();
          server.ws.send({ type: 'full-reload' });
        }
      });
    },
  }, {
    name: 'generate-theme-css',
    closeBundle() {
      // theme.css is the consumable stylesheet for downstream apps (exported as `./theme`).
      // It's generated from tokens.css by dropping the `@import "tailwindcss"` line, since
      // consumers already import tailwindcss themselves — they only need the token/@theme registration.
      // tokens.css itself now @imports generated.css for the @theme inline registration and the
      // text-size/radius/spacing sections (see src/lib/generateTokensCss.ts) — that import is
      // inlined here too, since theme.css must stay a single self-contained file for consumers
      // (no relative import to a file we don't publish).
      const tokens = readFileSync(TOKENS_CSS_PATH, 'utf-8');
      const generated = readFileSync(GENERATED_CSS_PATH, 'utf-8');
      const theme = tokens
        .replace(/^\/\*[\s\S]*?\*\/\n/, '') // drop the source(none) rationale comment
        .replace(/^@import ['"]tailwindcss['"](?: source\(none\))?;\n+/, '')
        .replace(/^@import ['"]\.\/generated\.css['"];\n/m, `${generated}\n`);
      writeFileSync(resolve(dirname, 'dist/theme.css'), theme);
    },
  }],
  resolve: {
    alias: {
      '@primitives': resolve(dirname, 'src/primitives'),
      '@components': resolve(dirname, 'src/components'),
      '@lib': resolve(dirname, 'src/lib'),
      '@styles': resolve(dirname, 'src/styles')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime']
    }
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }, {
      extends: true,
      test: {
        name: 'unit',
        environment: 'node',
        include: ['src/**/*.test.ts', 'scripts/**/*.test.mjs']
      }
    }]
  }
});