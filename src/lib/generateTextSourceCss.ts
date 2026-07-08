import { TEXT_SCALE } from './textScale';

// Generates the @source safelist for the text-* size scale from TEXT_SCALE
// — see vite.config.ts's generate-tokens-css plugin, which appends this
// into src/styles/generated.css (imported from tokens.css via a real CSS
// @import, required to stay inside the CSS import graph rooted at
// `@import "tailwindcss"` — a bare @source directive reached only via a
// .tsx-side import is silently ignored).
export function generateTextSourceCss(): string {
  const slugs = Object.values(TEXT_SCALE)
    .map((e) => e.slug)
    .join(',');

  return `/* GENERATED — do not edit by hand. Produced from src/lib/textScale.ts by
 * src/lib/generateTextSourceCss.ts (see vite.config.ts's generate-tokens-css
 * plugin).
 *
 * Text.tsx builds its font-size class as \`text-\${TEXT_SCALE[variant].slug}\`
 * — a template literal, not a literal class name — so no scanner (ours or a
 * consumer's) can find these by reading source text, regardless of
 * source(none). Force them in explicitly instead. */
@source inline("text-{${slugs}}");
`;
}
