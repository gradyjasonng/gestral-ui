import { describe, expect, it } from 'vitest';
import {
  buildTokenSet,
  extractBuiltTheme,
  extractGeneratedRoot,
  resolveVar,
  splitLightDark,
  toFigmaColor,
} from './export-figma-tokens.mjs';

const FIXTURE_BUILT_CSS = `@layer theme{:root,:host{--spacing:.25rem;--text-9xl:8rem;--color-white:#fff;--color-stone-100:oklch(97% .001 106.424);--color-stone-900:oklch(21.6% .006 56.043);}}`;

const FIXTURE_TOKENS_CSS = `
:root {
  --color-chrome-surface: var(--color-white);
  --color-chrome-muted: var(--color-stone-100);
  --icon-size-xs: calc(var(--spacing) * 4);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-chrome-surface: var(--color-stone-900);
  }
}
`;

const FIXTURE_GENERATED_CSS = `
:root {
  --text-hero: var(--text-9xl);
  --radius-pill: 9999px;
  --spacing-sp-xs: calc(var(--spacing) * 1);
}

@theme inline {
  --color-chrome-surface: var(--color-chrome-surface);
  --text-hero: var(--text-hero);
}
`;

describe('extractBuiltTheme', () => {
  it('parses the flat @layer theme{:root,:host{...}} block', () => {
    const theme = extractBuiltTheme(FIXTURE_BUILT_CSS);
    expect(theme.get('--spacing')).toBe('.25rem');
    expect(theme.get('--color-white')).toBe('#fff');
  });
});

describe('splitLightDark', () => {
  it('separates the hand-authored :root from its dark media-query override, ignoring the mirror in generated.css', () => {
    const { light, dark } = splitLightDark(FIXTURE_TOKENS_CSS);
    expect(light.get('--color-chrome-surface')).toBe('var(--color-white)');
    expect(dark.get('--color-chrome-surface')).toBe('var(--color-stone-900)');
  });
});

describe('extractGeneratedRoot', () => {
  it('only reads the plain :root block, not the circular @theme inline mirror', () => {
    const root = extractGeneratedRoot(FIXTURE_GENERATED_CSS);
    expect(root.get('--text-hero')).toBe('var(--text-9xl)');
    expect(root.get('--radius-pill')).toBe('9999px');
    // regression check: the @theme inline mirror below the real :root block
    // self-references (`--color-chrome-surface: var(--color-chrome-surface)`)
    // and must never be picked up as a value source.
    expect(root.has('--color-chrome-surface')).toBe(false);
  });
});

describe('resolveVar', () => {
  it('walks a var() chain across multiple maps in priority order', () => {
    const a = new Map([['--foo', 'var(--bar)']]);
    const b = new Map([['--bar', '9999px']]);
    expect(resolveVar('var(--foo)', a, b)).toBe('9999px');
  });

  it('returns literal values unchanged', () => {
    expect(resolveVar('9999px', new Map())).toBe('9999px');
  });

  it('throws on an unresolved reference', () => {
    expect(() => resolveVar('var(--missing)', new Map())).toThrow(/Unresolved token reference/);
  });
});

describe('toFigmaColor', () => {
  it('converts oklch() to 0..1 rgba', () => {
    const { r, g, b, a } = toFigmaColor('oklch(97% .001 106.424)');
    expect(r).toBeCloseTo(0.964, 2);
    expect(g).toBeCloseTo(0.964, 2);
    expect(b).toBeCloseTo(0.962, 2);
    expect(a).toBe(1);
  });

  it('converts hex colors (Tailwind keyword colors like white are not oklch)', () => {
    expect(toFigmaColor('#fff')).toEqual({ r: 1, g: 1, b: 1, a: 1 });
  });
});

describe('buildTokenSet', () => {
  it('resolves semantic colors per mode, and text/radius/spacing/icon scales, from the three source files', () => {
    const tokenSet = buildTokenSet({
      builtCss: FIXTURE_BUILT_CSS,
      tokensCss: FIXTURE_TOKENS_CSS,
      generatedCss: FIXTURE_GENERATED_CSS,
    });

    expect(tokenSet.color['chrome-surface'].light).toEqual({ r: 1, g: 1, b: 1, a: 1 });
    expect(tokenSet.color['chrome-surface'].dark.r).toBeCloseTo(0.11, 2);
    // no dark override declared -> falls back to the light value
    expect(tokenSet.color['chrome-muted'].dark).toEqual(tokenSet.color['chrome-muted'].light);

    expect(tokenSet.fontSize.hero).toBe(128);
    expect(tokenSet.borderRadius.pill).toBe(9999);
    expect(tokenSet.spacing['sp-xs']).toBe(4);
    expect(tokenSet.iconSize.xs).toBe(16);
  });
});
