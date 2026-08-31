import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, type GridColumns } from './Grid';
import { Text } from '@primitives/Text/Text';

const meta = {
  title: 'Primitives/Grid',
  component: Grid,
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

function Box({ children }: { children?: React.ReactNode }) {
  return (
    <div className="bg-chrome-border px-3 py-2 rounded-sm">
      <Text variant="caption" as="span" className="font-mono text-chrome-text-secondary">
        {children ?? 'Item'}
      </Text>
    </div>
  );
}

/**
 * `columns={2}` (the default) — a sensible starting point for the most
 * common case, a two-up card/preview grid. Item count needn't be a multiple
 * of `columns`; the last row just leaves empty cells.
 */
export const Default: Story = {
  render: () => (
    <Grid gap="md">
      <Box>First</Box>
      <Box>Second</Box>
      <Box>Third</Box>
      <Box>Fourth</Box>
      <Box>Fifth</Box>
    </Grid>
  ),
};

/**
 * `columns` from 1 through 6, compared side by side. For a column count
 * that changes per breakpoint, pass a Tailwind class string instead — see
 * `Responsive` below.
 */
export const Columns: Story = {
  render: () => (
    <Grid gap="lg" columns={1}>
      {([1, 2, 3, 4, 5, 6] as GridColumns[]).map((columns) => (
        <Grid key={columns} gap="sm" columns={1}>
          <Text variant="caption" as="span" className="font-mono text-chrome-text-muted">
            columns={'{' + columns + '}'}
          </Text>
          <Grid gap="sm" columns={columns}>
            {Array.from({ length: columns * 2 }, (_, i) => (
              <Box key={i} />
            ))}
          </Grid>
        </Grid>
      ))}
    </Grid>
  ),
};

/**
 * `columns` also accepts a raw string of Tailwind `grid-cols-*` classes
 * (with responsive prefixes) instead of a fixed number, for a column count
 * that should change per breakpoint — passed straight through as literal
 * classes rather than resolved through a lookup, so `sm:`/`lg:`/etc. work
 * exactly as they would in a plain `className`. Resize this story's preview
 * viewport to see it collapse from 3 columns down to 1.
 */
export const Responsive: Story = {
  render: () => (
    <Grid gap="md" columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <Box>First</Box>
      <Box>Second</Box>
      <Box>Third</Box>
      <Box>Fourth</Box>
      <Box>Fifth</Box>
      <Box>Sixth</Box>
    </Grid>
  ),
};

/**
 * `align`/`justify` position each item within its own cell — `align-items`
 * and `justify-items` respectively, not `justify-content` (which
 * distributes the grid's own tracks rather than each item within them).
 * Here, cells are taller than their content via a fixed row height, so the
 * effect is visible.
 */
export const ItemAlignment: Story = {
  render: () => (
    <Grid gap="md" columns={3} align="center" justify="center" className="*:h-24 *:bg-chrome-surface *:border *:border-chrome-border">
      <Box>Centered</Box>
      <Box>Centered</Box>
      <Box>Centered</Box>
    </Grid>
  ),
};
