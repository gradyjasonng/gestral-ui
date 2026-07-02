import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, type StackGap } from './Stack';
import { Text } from '../Text/Text';

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

export const Vertical: Story = {
  render: () => (
    <Stack direction="col" gap="md">
      <Box>First</Box>
      <Box>Second</Box>
      <Box>Third</Box>
    </Stack>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Stack direction="row" gap="md" align="center">
      <Box>First</Box>
      <Box>Second</Box>
      <Box>Third</Box>
    </Stack>
  ),
};

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

export const Wrapping: Story = {
  render: () => (
    <Stack direction="row" gap="sm" wrap className="max-w-xs">
      {['Design', 'Tools', 'React', 'TypeScript', 'Tailwind', 'Storybook', 'Figma'].map((tag) => (
        <Box key={tag}>{tag}</Box>
      ))}
    </Stack>
  ),
};
