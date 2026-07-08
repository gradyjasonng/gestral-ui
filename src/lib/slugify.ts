/**
 * Deterministic label -> id slug. No dedup/counter state, unlike e.g.
 * github-slugger, so it can be computed independently in two different
 * places (Artboard's own `id`, and a consumer's remark plugin building a
 * table of contents from `label`s) and still agree on the same string.
 * Callers are responsible for keeping labels unique per page.
 */
export function slugify(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
