import { TEXT_SCALE } from './textScale';
import { RADIUS_SCALE } from './radiusScale';
import { SPACING_INLINE_SCALE, SPACING_STACK_SCALE } from './spacingScale';

const CUSTOM_PROPERTY_DECLARATION = /(--[a-zA-Z0-9-]+)\s*:/g;

function extractCustomPropertyNames(css: string): string[] {
  const names = new Set<string>();
  for (const match of css.matchAll(CUSTOM_PROPERTY_DECLARATION)) {
    names.add(match[1]);
  }
  return Array.from(names);
}

// Generates the entire `@theme inline { ... }` Tailwind-registration block,
// plus the text-size/line-height/radius/spacing-inline/spacing-stack :root
// declarations, into one generated.css — see vite.config.ts's
// generate-tokens-css plugin. Tailwind v4 only auto-generates utilities for
// tokens declared inside `@theme`; declaring a token only in a plain :root
// (as tokens.css's hand-authored colors/fonts/icon-size are) makes it
// available as a CSS custom property but not as a Tailwind utility, so
// every one of those also needs mirroring into `@theme inline`. Rather than
// hand-maintaining that mirror (the previous source of drift), this reads
// tokens.css's own hand-authored `:root` text and mirrors whatever custom
// properties it finds — nothing to keep in sync by hand for colors/fonts/
// icon-size either.
export function generateTokensCss(handAuthoredTokensCss: string): string {
  const text = Object.values(TEXT_SCALE);
  const radius = Object.values(RADIUS_SCALE);
  const inline = Object.values(SPACING_INLINE_SCALE);
  const stack = Object.values(SPACING_STACK_SCALE);

  const sizeLines = text.map((e) => `  --text-${e.slug}: ${e.size};`).join('\n');
  const leadingLines = text
    .map((e) => `  --leading-${e.slug}: ${e.leading};${e.leadingComment !== '' ? ` /* ${e.leadingComment} */` : ''}`)
    .join('\n');
  const lineHeightLines = text.map((e) => `  --text-${e.slug}--line-height: var(--leading-${e.slug});`).join('\n');
  const radiusLines = radius.map((e) => `  --radius-${e.slug}: ${e.value};`).join('\n');
  const inlineLines = inline.map((e) => `  --spacing-${e.slug}: calc(var(--spacing) * ${e.multiplier}); /* ${e.comment} */`).join('\n');
  const stackLines = stack.map((e) => `  --spacing-${e.slug}: calc(var(--spacing) * ${e.multiplier}); /* ${e.comment} */`).join('\n');

  const themeSizeLines = text
    .map((e) => `  --text-${e.slug}: var(--text-${e.slug});\n  --text-${e.slug}--line-height: var(--text-${e.slug}--line-height);`)
    .join('\n');
  const themeLeadingLines = text.map((e) => `  --leading-${e.slug}: var(--leading-${e.slug});`).join('\n');
  const themeRadiusLines = radius.map((e) => `  --radius-${e.slug}: var(--radius-${e.slug});`).join('\n');
  const themeInlineLines = inline.map((e) => `  --spacing-${e.slug}: var(--spacing-${e.slug});`).join('\n');
  const themeStackLines = stack.map((e) => `  --spacing-${e.slug}: var(--spacing-${e.slug});`).join('\n');

  const handAuthoredNames = extractCustomPropertyNames(handAuthoredTokensCss);
  const handAuthoredMirrorLines = handAuthoredNames.map((name) => `  ${name}: var(${name});`).join('\n');

  return `/* GENERATED — do not edit by hand. Produced from
 * src/lib/{textScale,radiusScale,spacingScale}.ts and tokens.css's own
 * hand-authored :root by src/lib/generateTokensCss.ts (see vite.config.ts's
 * generate-tokens-css plugin). Edit those instead — see CLAUDE.md. */

:root {
  /* Typography: size scale — one token per Text variant, mapped back to Tailwind's text-* scale */
${sizeLines}

  /* Typography: line-height scale — one token per Text variant, mapped back to Tailwind's leading-* scale */
${leadingLines}

${lineHeightLines}

  /* Radius */
${radiusLines}

  /* Spacing: inline (horizontal) — maps back to Tailwind's px-N utilities */
${inlineLines}

  /* Spacing: stack (vertical) — maps back to Tailwind's py-N utilities */
${stackLines}
}

@theme inline {
  /* Colors, fonts, and icon-size — mirrored from tokens.css's hand-authored :root */
${handAuthoredMirrorLines}

  /* Text, leading, radius, and spacing-inline/stack — from src/lib/{textScale,radiusScale,spacingScale}.ts */
${themeSizeLines}

${themeLeadingLines}

${themeRadiusLines}

${themeInlineLines}

${themeStackLines}
}
`;
}
