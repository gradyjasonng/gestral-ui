import { Rail } from '../../primitives/Rail/Rail';
import { RailHeader } from '../RailHeader/RailHeader';
import { RailSection } from '../RailSection/RailSection';
import { Button } from '../../primitives/Button/Button';
import { Text } from '../../primitives/Text/Text';
import { Stack } from '../../primitives/Stack/Stack';
import { cn } from '../../lib/cn';

export type NodeIndent = 0 | 1 | 2;

const indentPadding: Record<NodeIndent, string> = {
  0: 'pl-3',
  1: 'pl-7',
  2: 'pl-11',
};

export interface TocItem {
  label: string;
  href: string;
  depth?: 2 | 3;
  active?: boolean | 'secondary';
}

export interface MetaEntry {
  key: string;
  value: string | string[];
}

export interface CanvasRailProps {
  siteName: string;
  /** Section display name (e.g. "Blog") — maps to an item in SiteRail */
  section?: string;
  toc?: TocItem[];
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

export function CanvasRail({
  siteName,
  section,
  toc,
  meta,
  className,
}: CanvasRailProps) {
  const hasLayers = toc && toc.length > 0;
  const hasMeta = meta && meta.length > 0;

  return (
    <Rail width="w-[220px]" aria-label="Section navigation" className={cn(className)}>
      <RailHeader title={siteName} subtitle={section} className="pl-inline-md" />
      <hr className="border-chrome-border" />

      {hasLayers && (
        <RailSection label="Layers">
          <Stack direction="col" gap="xs" padding="xs">
            {toc!.map((item) => (
              <NodeButton
                key={item.href}
                label={item.label}
                href={item.href}
                active={item.active}
                indent={item.depth === 3 ? 1 : 0}
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
                  <Text variant="eyebrow" as="dt" className="text-chrome-text-muted">
                    {key}
                  </Text>
                  {Array.isArray(value) ? (
                    <Stack as="dd" direction="row" gap="sm" wrap>
                      {value.map((tag) => (
                        <Text
                          key={tag}
                          variant="eyebrow"
                          as="span"
                          className="px-1.5 py-0.5 rounded-sm bg-chrome-surface-hover text-chrome-text-secondary border border-chrome-border"
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
