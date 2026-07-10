// Canonical source of truth for the spacing scale — a single axis of presets
// (xs..3xl) used for both horizontal and vertical spacing (e.g. `px-sp-xl`,
// `py-sp-lg`, `gap-sp-md`). Previously this was two parallel inline/stack
// scales with identical pixel values under different slugs; collapsed to one
// scale since directionality is already expressed by the Tailwind property
// itself (`px-`/`py-`/`gap-`/etc.), not by the token name.
//
// Slugs are prefixed `sp-` (not bare `xs`/`sm`/etc.) because Tailwind v4's
// `--spacing-*` theme namespace isn't exclusive to padding/margin/gap — it's
// also consulted by `w-*`/`h-*`/`max-w-*`/`min-w-*`/`size-*`, and Tailwind's
// own `--container-*` scale (used by `max-w-xl` etc.) uses the exact same
// bare names (xs, sm, md, lg, xl, 2xl, 3xl, ...7xl). A `--spacing-xl` entry
// silently wins over `--container-xl` for `w-xl`/`max-w-xl`/`min-w-xl`
// (confirmed empirically — Tailwind checks `--spacing-*` before
// `--container-*` regardless of declaration order), so `max-w-xl` would
// quietly stop meaning "36rem" and start meaning our 24px preset. The `sp-`
// prefix sidesteps that entirely: it doesn't collide with any Tailwind
// scale, so `p-sp-xl`/`gap-sp-md`/etc. are unambiguous while `w-xl`/
// `max-w-xl` keep their stock container-scale meaning.
//
// tokens.css's --spacing-* @theme registration and cn.ts's tailwind-merge
// registration are both generated from or derived from this object — see
// src/lib/generateTokensCss.ts. `slug` is the full suffix used in both the
// CSS var name (`--spacing-{slug}`) and the Tailwind class (`px-{slug}`/
// `py-{slug}`/etc.).
export interface SpacingEntry {
  slug: string;
  multiplier: number;
  comment: string;
}

export const SPACING_SCALE = {
  xs:  { slug: 'sp-xs',  multiplier: 1,  comment: 'p-1' },
  sm:  { slug: 'sp-sm',  multiplier: 2,  comment: 'p-2' },
  md:  { slug: 'sp-md',  multiplier: 3,  comment: 'p-3' },
  lg:  { slug: 'sp-lg',  multiplier: 5,  comment: 'p-5' },
  xl:  { slug: 'sp-xl',  multiplier: 8,  comment: 'p-8' },
  '2xl': { slug: 'sp-2xl', multiplier: 13,  comment: 'p-13' },
  '3xl': { slug: 'sp-3xl', multiplier: 21, comment: 'p-21' },
} satisfies Record<string, SpacingEntry>;
