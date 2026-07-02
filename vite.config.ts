/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [tailwindcss(), react(), dts({
    include: ['src'],
    exclude: ['src/**/*.stories.tsx'],
  }), {
    name: 'generate-theme-css',
    closeBundle() {
      // theme.css is the consumable stylesheet for downstream apps (exported as `./theme`).
      // It's generated from tokens.css by dropping the `@import "tailwindcss"` line, since
      // consumers already import tailwindcss themselves — they only need the token/@theme registration.
      const tokens = readFileSync(resolve(dirname, 'src/styles/tokens.css'), 'utf-8');
      const theme = tokens.replace(/^@import ['"]tailwindcss['"];\n+/, '');
      writeFileSync(resolve(dirname, 'dist/theme.css'), theme);
    },
  }],
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
    }]
  }
});