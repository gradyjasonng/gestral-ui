import { Fragment } from 'react';
import { Text, Grid, Stack } from '@primitives';
import { Tag } from '@components/Tag/Tag';
import { InputText } from '@components/InputText/InputText';

export interface MetaEntry {
  key: string;
  value: string | string[];
}

export interface MetaListProps {
  meta: MetaEntry[];
  className?: string;
}

/**
 * A `key: value` definition list laid out in two columns — the label on the
 * left, the value on the right as a read-only `InputText` (or, for a list
 * value, a wrapping cluster of `inset` `Tag`s). The metadata block used in
 * a rail's "Info" section, e.g. a post's published date, reading time, and
 * tags. Styled after a Figma properties panel.
 */
export function MetaList({ meta, className }: MetaListProps) {
  return (
    <Grid
      as="dl"
      columns="grid-cols-[auto_1fr]"
      gap="md"
      padding="sm-squish"
      align="center"
      className={className}
    >
      {meta.map(({ key, value }) => (
        <Fragment key={key}>
          <Text variant="caption" as="dt" className="text-chrome-text-secondary">
            {key}
          </Text>
          {Array.isArray(value) ? (
            <Stack as="dd" direction="row" wrap gap="xs" className="min-w-0">
              {value.map((tag) => (
                <Tag key={tag} variant="inset" as="span" className="lowercase">
                  {tag}
                </Tag>
              ))}
            </Stack>
          ) : (
            <dd className="min-w-0">
              <InputText readOnly value={value} aria-label={key} />
            </dd>
          )}
        </Fragment>
      ))}
    </Grid>
  );
}
