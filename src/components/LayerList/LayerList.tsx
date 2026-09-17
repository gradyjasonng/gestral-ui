import { Stack, type IconName } from '@primitives';
import { Button } from '@components/Button/Button';
import { DEFAULT_ARTBOARD_ICON } from '@lib/defaultArtboardIcon';

export type NodeIndent = 0 | 1 | 2;

// Additional left margin layered on top of the Button's own `p-sp-sm` inset
// (not a `pl-*` override — that would replace the button's base padding
// instead of adding to it, breaking alignment with RailSection's label and
// PageList's items, which both rely on that same base inset for depth 0).
const indentMargin: Record<NodeIndent, string> = {
  0: '',
  1: 'ml-4',
  2: 'ml-8',
};

export interface TocItem {
  label: string;
  href: string;
  /**
   * Nesting depth: `2` is top-level, `3` is one level nested, `4` two levels,
   * etc. — mirrors markdown heading depth (h2/h3) but also fits arbitrarily
   * nested Artboards. Depths beyond what `NodeIndent` supports (3 levels)
   * flatten to the deepest available indent.
   */
  depth?: number;
  active?: boolean | 'secondary';
  /** Leading icon for the row. Defaults to `DEFAULT_ARTBOARD_ICON` (a frame) — the same fallback `Artboard`'s own label uses; set it to use a different icon for this entry. */
  icon?: IconName;
}

function indentForDepth(depth?: number): NodeIndent {
  return Math.min(Math.max((depth ?? 2) - 2, 0), 2) as NodeIndent;
}

export interface LayerListProps {
  items: TocItem[];
  className?: string;
}

/** Translates a page's table-of-contents (`TocItem[]`, nestable via `depth`) into a rail's "Layers" list — e.g. a blog post's headings/Artboards. Each row leads with a frame icon (per-item overridable via `TocItem.icon`) to echo the Figma layers metaphor. Render inside a `RailSection label="Layers"`. */
export function LayerList({ items, className }: LayerListProps) {
  return (
    <Stack direction="col" gap="xs" className={className}>
      {items.map((item) => (
        <Button
          key={item.href}
          variant="horizontal"
          size="sm"
          icon={item.icon ?? DEFAULT_ARTBOARD_ICON}
          href={item.href}
          active={item.active}
          className={indentMargin[indentForDepth(item.depth)]}
        >
          {item.label}
        </Button>
      ))}
    </Stack>
  );
}
