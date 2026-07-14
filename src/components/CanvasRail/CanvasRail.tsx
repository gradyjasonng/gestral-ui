import type { ReactNode } from 'react';
import { Rail, Button, Text, Stack } from '@primitives';
import { RailHeader } from '@components/RailHeader/RailHeader';
import { RailSection } from '@components/RailSection/RailSection';
import { cn } from '@lib/cn';

export type NodeIndent = 0 | 1 | 2;

const indentPadding: Record<NodeIndent, string> = {
  0: 'pl-3',
  1: 'pl-7',
  2: 'pl-11',
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
}

function indentForDepth(depth?: number): NodeIndent {
  return Math.min(Math.max((depth ?? 2) - 2, 0), 2) as NodeIndent;
}

export interface MetaEntry {
  key: string;
  value: string | string[];
}

export interface CanvasRailProps {
  title: string;
  /** Subtitle display name (e.g. "Blog") — maps to an item in SiteRail */
  subtitle?: string;
  /** Thumbnail content rendered above the title/subtitle — see `RailHeader`'s `above` prop */
  above?: ReactNode;
  items?: TocItem[];
  meta?: MetaEntry[];
  className?: string;
}

function Divider() {
  return <hr className="border-chrome-border mx-0" />;
}

function NodeButton({ label, href, active, indent = 0 }: { label: string; href: string; active?: boolean | 'secondary'; indent?: NodeIndent }) {
  return (
    <Button variant="horizontal" size="sm" href={href} active={active} className={cn(indentPadding[indent])}>
      {label}
    </Button>
  );
}

/** The secondary, page-scoped rail: a title/subtitle header, an optional table-of-contents (`items`, nestable via `depth`), and an optional metadata list (`meta`). Paired with `Canvas` to navigate within a single page. */
export function CanvasRail({
  title,
  subtitle,
  above,
  items,
  meta,
  className,
}: CanvasRailProps) {
  const hasLayers = items && items.length > 0;
  const hasMeta = meta && meta.length > 0;

  return (
    <Rail width="w-[min(25vw,16rem)]" aria-label="Section navigation" className={cn(className)}>
      <RailHeader title={title} subtitle={subtitle} above={above} />
      <hr className="border-chrome-border" />

      {hasLayers && (
        <RailSection label="Layers">
          <Stack direction="col" gap="xs" padding="xs">
            {items!.map((item) => (
              <NodeButton
                key={item.href}
                label={item.label}
                href={item.href}
                active={item.active}
                indent={indentForDepth(item.depth)}
              />
            ))}
          </Stack>
        </RailSection>
      )}

      {hasMeta && (
        <>
          {hasLayers && <Divider />}
          <RailSection label="Info">
            <Stack as="dl" direction="col" gap="md" className="px-3 py-1">
              {meta!.map(({ key, value }) => (
                <Stack key={key} direction="col" gap="xs">
                  <Text variant="eyebrow" as="dt" className="text-chrome-text-secondary">
                    {key}
                  </Text>
                  {Array.isArray(value) ? (
                    <Stack as="dd" direction="row" gap="sm" wrap>
                      {value.map((tag) => (
                        <Text
                          key={tag}
                          variant="labelXSmall"
                          as="span"
                          className="px-sp-xs py-sp-2xs rounded-sm bg-chrome-surface-hover text-chrome-text-muted border border-chrome-border"
                        >
                          {tag}
                        </Text>
                      ))}
                    </Stack>
                  ) : (
                    <Text variant="caption" as="dd" className="text-chrome-text-primary">
                      {value}
                    </Text>
                  )}
                </Stack>
              ))}
            </Stack>
          </RailSection>
        </>
      )}

      <div className="flex-1" />
    </Rail>
  );
}
