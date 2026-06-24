import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta = {
  title: 'Typography/Text',
  component: Text,
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {([
        ['hero', 'Hero'],
        ['h1', 'Heading 1'],
        ['h2', 'Heading 2'],
        ['h3', 'Heading 3'],
        ['subheading1', 'Subheading 1'],
        ['subheading2', 'Subheading 2'],
        ['subheading3', 'Subheading 3'],
        ['overline', 'Overline'],
        ['body', 'Body'],
        ['bodySmall', 'Body Small'],
        ['prose', 'Prose'],
        ['labelSmall', 'Label Small'],
        ['labelXSmall', 'Label XSmall'],
      ] as const).map(([variant, label]) => (
        <div key={variant} className="flex items-baseline gap-4">
          <span className="w-32 shrink-0 font-mono text-xs text-foreground-muted">{label}</span>
          <Text variant={variant}>Gestral UI</Text>
        </div>
      ))}
    </div>
  ),
};
