import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import { TEXT_SCALE } from './textScale';
import { RADIUS_SCALE } from './radiusScale';
import { SPACING_SCALE } from './spacingScale';

// Gestral's custom text-* size scale (see src/lib/textScale.ts / tokens.css) isn't
// known to tailwind-merge's default config, so `text-eyebrow` etc. get misclassified
// into the `text-color` group and silently dropped when merged with a `text-{color}`
// class. Same problem for `rounded-pill` (tailwind-merge's default `rounded` scale
// only recognizes sm/md/lg/xl/2xl/3xl/full/none) and for the custom spacing suffixes
// (tailwind-merge's padding/margin scales only recognize the stock numeric scale and
// arbitrary `[...]` values) — in each case, without registering the custom suffix,
// both the old and new class survive a `cn()` merge and whichever lands later in the
// compiled CSS wins, regardless of argument order. All three registrations are
// derived from the same canonical scale modules Text.tsx and tokens.generated.css use,
// so there's nothing to keep in sync by hand.
const textSlugs = Object.values(TEXT_SCALE).map((e) => e.slug);
const radiusSlugs = Object.values(RADIUS_SCALE).map((e) => e.slug);
const spacingSlugs = Object.values(SPACING_SCALE).map((e) => e.slug);

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: textSlugs }],
      rounded: [{ rounded: radiusSlugs }],
      // Registered under every directional padding/margin group, not just
      // px/py — a conflicting `pl-*`/`mb-*`/etc. override needs to evict
      // these the same way `px-*`/`py-*` already did (e.g. CanvasRail's
      // `pl-sp-md`, Page's `mb-sp-lg` previously weren't covered at
      // all, so a later conflicting class wouldn't reliably win).
      p:  [{ p:  spacingSlugs }],
      px: [{ px: spacingSlugs }],
      py: [{ py: spacingSlugs }],
      pt: [{ pt: spacingSlugs }],
      pr: [{ pr: spacingSlugs }],
      pb: [{ pb: spacingSlugs }],
      pl: [{ pl: spacingSlugs }],
      m:  [{ m:  spacingSlugs }],
      mx: [{ mx: spacingSlugs }],
      my: [{ my: spacingSlugs }],
      mt: [{ mt: spacingSlugs }],
      mr: [{ mr: spacingSlugs }],
      mb: [{ mb: spacingSlugs }],
      ml: [{ ml: spacingSlugs }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
