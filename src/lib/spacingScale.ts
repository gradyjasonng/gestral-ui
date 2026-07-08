// Canonical source of truth for the inline (horizontal) and stack (vertical)
// spacing scales. tokens.css's --spacing-inline-*/--spacing-stack-* @theme
// registration and cn.ts's tailwind-merge registration are both generated
// from or derived from these objects — see src/lib/generateTokensCss.ts.
// `slug` is the full suffix used in both the CSS var name
// (`--spacing-{slug}`) and the Tailwind class (`px-{slug}`/`py-{slug}`).
export interface SpacingEntry {
  slug: string;
  multiplier: number;
  comment: string;
}

export const SPACING_INLINE_SCALE = {
  xs: { slug: 'inline-xs', multiplier: 1, comment: '4px  — px-1' },
  sm: { slug: 'inline-sm', multiplier: 2, comment: '8px  — px-2' },
  md: { slug: 'inline-md', multiplier: 3, comment: '12px — px-3' },
  lg: { slug: 'inline-lg', multiplier: 4, comment: '16px — px-4' },
  xl: { slug: 'inline-xl', multiplier: 6, comment: '24px — px-6' },
} satisfies Record<string, SpacingEntry>;

export const SPACING_STACK_SCALE = {
  xs: { slug: 'stack-xs', multiplier: 1, comment: '4px  — py-1' },
  sm: { slug: 'stack-sm', multiplier: 2, comment: '8px  — py-2' },
  md: { slug: 'stack-md', multiplier: 3, comment: '12px — py-3' },
  lg: { slug: 'stack-lg', multiplier: 4, comment: '16px — py-4' },
  xl: { slug: 'stack-xl', multiplier: 6, comment: '24px — py-6' },
} satisfies Record<string, SpacingEntry>;
