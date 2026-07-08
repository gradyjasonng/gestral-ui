import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './Popover';

const meta = {
  title: 'Primitives/Popover',
  component: Popover,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-canvas-surface p-12">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The note card in isolation, using the `annotation` (accent) variant —
 * `Comment` is the component that actually positions and reveals this on
 * hover/tap.
 */
export const Annotation: Story = {
  args: {
    variant: 'annotation',
    children: 'A short aside providing extra context.',
  },
};
