import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, type StackGap } from './Stack';
import { Text } from '@primitives/Text/Text';

const meta = {
  title: 'Primitives/Stack',
  component: Stack,
} satisfies Meta<typeof Stack>;

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
 * `direction="col"` (the default) — children stacked top to bottom. Stack
 * is the primitive layout building block underneath most other components
 * here (Card, Button, RailHeader, etc.), so reach for it directly whenever
 * you need simple flex stacking without building a one-off `<div>`.
 */
export const Vertical: Story = {
  render: () => (
    <Stack direction="col" gap="md">
      <Box>First</Box>
      <Box>Second</Box>
      <Box>Third</Box>
    </Stack>
  ),
};

/**
 * `direction="row"` — children laid out left to right. `align="center"`
 * here vertically centers items of differing heights; use `align` whenever
 * row children don't share a height and shouldn't stretch to match.
 */
export const Horizontal: Story = {
  render: () => (
    <Stack direction="row" gap="md" align="center">
      <Box>First</Box>
      <Box>Second</Box>
      <Box>Third</Box>
    </Stack>
  ),
};

/**
 * All six `gap` values (`none` through `xl`) compared side by side — see
 * the `gapClass` map in `Stack.tsx` for the exact pixel value each maps to.
 * Prefer `sm`/`md` for tight chrome UI (icon groups, form fields) and
 * `lg`/`xl` for looser, layout-level spacing between larger blocks.
 */
export const Gaps: Story = {
  render: () => (
    <Stack direction="col" gap="xl">
      {(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as StackGap[]).map((gap) => (
        <Stack key={gap} direction="col" gap="sm">
          <Text variant="caption" as="span" className="font-mono text-chrome-text-muted">
            gap="{gap}"
          </Text>
          <Stack direction="row" gap={gap}>
            <Box />
            <Box />
            <Box />
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
};

/**
 * `wrap` allows row children to flow onto multiple lines instead of
 * overflowing or shrinking — useful for a tag/chip list of unpredictable
 * length inside a fixed-width container, as shown here via `max-w-xs`.
 */
export const Wrapping: Story = {
  render: () => (
    <Stack direction="row" gap="sm" wrap className="max-w-xs">
      {['Design', 'Tools', 'React', 'TypeScript', 'Tailwind', 'Storybook', 'Figma'].map((tag) => (
        <Box key={tag}>{tag}</Box>
      ))}
    </Stack>
  ),
};
