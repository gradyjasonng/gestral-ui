import { Text, Stack } from '@primitives';

export interface MetaEntry {
  key: string;
  value: string | string[];
}

export interface MetaListProps {
  meta: MetaEntry[];
  className?: string;
}

/** A `key: value` (or `key: value[]`, rendered as tags) definition list — the metadata block used in a rail's "Info" section, e.g. a post's published date, reading time, and tags. */
export function MetaList({ meta, className }: MetaListProps) {
  return (
    <Stack as="dl" direction="col" gap="md" className={className ?? 'px-3 py-1'}>
      {meta.map(({ key, value }) => (
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
  );
}
