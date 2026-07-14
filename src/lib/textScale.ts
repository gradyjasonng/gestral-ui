import type { ElementType } from 'react';

// Canonical source of truth for every Text variant. tokens.css's text-size/
// line-height @theme registration, Text.tsx's rendering, Text.css's Tailwind
// @source safelist, and cn.ts's tailwind-merge registration are all
// generated from or derived from this single object — see
// src/lib/generateTokensCss.ts and src/lib/generateTextSourceCss.ts.
export interface TextScaleEntry {
  /** CSS slug — the variant's `text-{slug}` utility and `--text-{slug}` token name. */
  slug: string;
  /** The variant's font-size value/reference, e.g. `var(--text-9xl)` or a literal like `10px`. */
  size: string;
  /** The variant's line-height value/reference, e.g. `1`, `var(--leading-normal)`, or `calc(var(--spacing) * 10)`. */
  leading: string;
  /** Human-readable annotation for the generated CSS, e.g. `leading-10` (empty string if none). */
  leadingComment: string;
  /** Default HTML element the variant renders as. */
  element: ElementType;
  /** Font-family/weight/casing/tracking classes for the variant (everything but size, which comes from `slug`). */
  className: string;
}

export const TEXT_SCALE = {
  hero:        { slug: 'hero',           size: 'var(--text-9xl)', leading: '1',                          leadingComment: 'leading-none', element: 'h1',   className: 'font-display font-normal uppercase' },
  h1:          { slug: 'h1',             size: 'var(--text-8xl)', leading: '1',                          leadingComment: 'leading-none', element: 'h1',   className: 'font-display font-normal uppercase' },
  h2:          { slug: 'h2',             size: 'var(--text-7xl)', leading: '1',                          leadingComment: 'leading-none', element: 'h2',   className: 'font-display font-normal uppercase' },
  h3:          { slug: 'h3',             size: 'var(--text-6xl)', leading: '1',                          leadingComment: 'leading-none', element: 'h3',   className: 'font-display font-normal uppercase' },
  subheading1: { slug: 'subheading-1',   size: 'var(--text-4xl)', leading: 'calc(var(--spacing) * 10)',  leadingComment: 'leading-10',   element: 'h4',   className: 'font-ui font-bold' },
  subheading2: { slug: 'subheading-2',   size: 'var(--text-2xl)', leading: 'calc(var(--spacing) * 8)',   leadingComment: 'leading-8',    element: 'h5',   className: 'font-ui font-bold' },
  // subheading2 size/leading, not bold — a lighter-weight heading
  headline:    { slug: 'headline',       size: 'var(--text-3xl)', leading: 'calc(var(--spacing) * 10)',   leadingComment: 'leading-10',    element: 'h5',   className: 'font-ui font-normal' },
  subheading3: { slug: 'subheading-3',   size: 'var(--text-xl)',  leading: 'calc(var(--spacing) * 7)',   leadingComment: 'leading-7',    element: 'h6',   className: 'font-ui font-bold' },
  // display font a step up from displaySm — larger labels, small standalone headings
  displayMd:   { slug: 'display-md',     size: 'var(--text-xl)',  leading: 'calc(var(--spacing) * 8)',   leadingComment: 'leading-8',    element: 'span', className: 'font-display font-normal uppercase tracking-wide' },
  // display font at label scale — used for site names, frame labels, badges
  displaySm:   { slug: 'display-sm',     size: 'var(--text-base)', leading: 'calc(var(--spacing) * 5)',  leadingComment: 'leading-5',    element: 'span', className: 'font-display font-normal uppercase tracking-wide' },
  // large section overline
  overline:    { slug: 'overline',       size: 'var(--text-base)', leading: 'calc(var(--spacing) * 5)',   leadingComment: 'leading-5',    element: 'p',    className: 'font-ui font-bold uppercase' },
  // micro overline — section labels, metadata keys, category tags
  eyebrow:     { slug: 'eyebrow',        size: 'var(--text-xs)',   leading: 'var(--leading-normal)',      leadingComment: '',             element: 'span', className: 'font-ui font-bold uppercase tracking-wide' },
  body:        { slug: 'body',           size: 'var(--text-base)', leading: 'calc(var(--spacing) * 6)',   leadingComment: 'leading-6',    element: 'p',    className: 'font-ui font-normal' },
  bodySmall:   { slug: 'body-sm',        size: 'var(--text-sm)',   leading: 'calc(var(--spacing) * 5)',   leadingComment: 'leading-5',    element: 'p',    className: 'font-ui font-normal' },
  // xs body weight — dates, descriptions, secondary chrome text
  caption:     { slug: 'caption',        size: 'var(--text-xs)',   leading: 'calc(var(--spacing) * 4)',   leadingComment: 'leading-4',    element: 'span', className: 'font-ui font-normal' },
  prose:       { slug: 'prose',          size: 'var(--text-base)', leading: 'calc(var(--spacing) * 8)',   leadingComment: 'leading-8',    element: 'p',    className: 'font-editorial font-normal' },
  labelSmall:  { slug: 'label-sm',       size: 'var(--text-sm)',   leading: 'calc(var(--spacing) * 4)',   leadingComment: 'leading-4',    element: 'span', className: 'font-ui font-bold' },
  labelXSmall: { slug: 'label-xs',       size: 'var(--text-xs)',   leading: 'calc(var(--spacing) * 4)',   leadingComment: 'leading-4',    element: 'span', className: 'font-ui font-bold' },
} satisfies Record<string, TextScaleEntry>;

export type TextVariant = keyof typeof TEXT_SCALE;
