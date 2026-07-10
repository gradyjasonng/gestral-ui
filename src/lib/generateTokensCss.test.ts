import { describe, expect, it } from 'vitest';
import { generateTokensCss } from './generateTokensCss';
import { generateTextSourceCss } from './generateTextSourceCss';
import { TEXT_SCALE } from './textScale';

const FIXTURE_TOKENS_CSS = `
:root {
  --color-chrome-surface: var(--color-white);
  --font-display: Kombi, system-ui;
  --icon-size-xs: calc(var(--spacing) * 3);
}
`;

describe('generateTokensCss', () => {
  it('emits a :root and @theme inline block covering every scale entry', () => {
    const css = generateTokensCss(FIXTURE_TOKENS_CSS);
    expect(css).toContain(':root {');
    expect(css).toContain('@theme inline {');
    expect(css).toContain('--text-caption: var(--text-xs);');
    expect(css).toContain('--radius-pill: 9999px;');
    expect(css).toContain('--spacing-sp-xs: calc(var(--spacing) * 1);');
    // regression check: --leading-display-md was previously missing from the
    // hand-authored @theme inline mirror block.
    expect(css).toContain('--leading-display-md: var(--leading-display-md);');
  });

  it('mirrors every custom property declared in the hand-authored tokens.css', () => {
    const css = generateTokensCss(FIXTURE_TOKENS_CSS);
    expect(css).toContain('--color-chrome-surface: var(--color-chrome-surface);');
    expect(css).toContain('--font-display: var(--font-display);');
    expect(css).toContain('--icon-size-xs: var(--icon-size-xs);');
  });
});

describe('generateTextSourceCss', () => {
  it('safelists every TEXT_SCALE slug', () => {
    const css = generateTextSourceCss();
    for (const entry of Object.values(TEXT_SCALE)) {
      expect(css).toContain(entry.slug);
    }
  });
});
