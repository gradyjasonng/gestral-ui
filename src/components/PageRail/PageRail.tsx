import { Rail } from '../../primitives/Rail/Rail';
import { RailHeader } from '../RailHeader/RailHeader';
import { Button } from '../../primitives/Button/Button';
import { Text } from '../../primitives/Text/Text';
import { Stack } from '../../primitives/Stack/Stack';
import { Icon, type IconName } from '../../primitives/Icon/Icon';
import { cn } from '../../lib/cn';

export type NodeIndent = 0 | 1 | 2;

export interface PageItem {
  label: string;
  icon?: IconName;
  active?: boolean | 'secondary';
  indent?: NodeIndent;
  href?: string;
  onClick?: () => void;
  className?: string;
}

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

export interface PageRailProps {
  siteName: string;
  /** Section display name (e.g. "Blog") — maps to an item in SiteRail */
  section?: string;
  /** Section href (e.g. "/blog") — used for the back chevron button */
  href?: string;
  pages?: PageItem[];
  toc?: TocItem[];
  meta?: MetaEntry[];
  className?: string;
  /** When false, renders as a flex child (for use inside Sidebar) */
  fixed?: boolean;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text variant="eyebrow" as="p" className="px-3 py-1.5 text-chrome-text-muted select-none">
      {children}
    </Text>
  );
}

function Divider() {
  return <hr className="border-chrome-border mx-0" />;
}

function NodeButton({ label, icon, active, indent = 0, href, onClick, className }: PageItem) {
  return (
    <Button
      variant="horizontal"
      size="sm"
      icon={icon}
      href={href}
      onClick={onClick}
      active={active}
      className={cn(indentPadding[indent], className)}
    >
      {label}
    </Button>
  );
}

export function PageRail({
  siteName,
  section,
  href,
  pages,
  toc,
  meta,
  className,
  fixed = true,
}: PageRailProps) {
  const hasLayers = toc && toc.length > 0;
  const hasMeta = meta && meta.length > 0;

  return (
    <Rail width="w-[220px]" aria-label="Section navigation" fixed={fixed} className={cn(className)}>
      <RailHeader
        left={
          href ? (
            <Button variant="iconOnly" size="lg" icon="chevron-left" href={href} aria-label={`Back to ${section ?? 'section'}`} />
          ) : undefined
        }
        title={siteName}
        subtitle={section}
      />
      <hr className="border-chrome-border" />

      {pages && pages.length > 0 && (
        <Stack direction="col" gap="none" className="py-2">
          <SectionLabel>Pages</SectionLabel>
          <Stack direction="col" gap="xs" padding="xs">
            {pages.map((item) => (
              <NodeButton key={item.label} {...item} />
            ))}
          </Stack>
        </Stack>
      )}

      {hasLayers && (
        <>
          <Divider />
          <Stack direction="col" gap="none" className="py-2">
            <SectionLabel>Layers</SectionLabel>
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
          </Stack>
        </>
      )}

      {hasMeta && (
        <>
          <Divider />
          <Stack direction="col" gap="none" className="py-2">
            <SectionLabel>Info</SectionLabel>
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
          </Stack>
        </>
      )}

      <div className="flex-1" />
    </Rail>
  );
}
