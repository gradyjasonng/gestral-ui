// Canonical source of truth for the radius scale. tokens.css's --radius-*
// @theme registration and cn.ts's tailwind-merge registration are both
// generated from or derived from this object — see
// src/lib/generateTokensCss.ts. Only `pill` is unknown to tailwind-merge's
// built-in `rounded` scale (sm/md/lg duplicate Tailwind defaults, kept here
// purely for centralized token management).
export interface RadiusEntry {
  slug: string;
  value: string;
}

export const RADIUS_SCALE = {
  sm:   { slug: 'sm', value: '4px' },
  md:   { slug: 'md', value: '6px' },
  lg:   { slug: 'lg', value: '8px' },
  pill: { slug: 'pill', value: '9999px' },
} satisfies Record<string, RadiusEntry>;

export type RadiusVariant = keyof typeof RADIUS_SCALE;
