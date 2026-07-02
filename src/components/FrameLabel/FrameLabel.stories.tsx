import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrameLabel } from './FrameLabel';

const meta = {
  title: 'Components/FrameLabel',
  component: FrameLabel,
  tags: ['autodocs'],
  args: { label: 'Selected Work' },
  decorators: [
    (Story) => (
      <div className="bg-canvas-surface p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FrameLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = { args: { size: 'sm' } };
export const XSmall: Story = { args: { size: 'xs' } };

export const BothSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <FrameLabel label="Selected Work" size="sm" />
      <FrameLabel label="Layer name" size="xs" />
    </div>
  ),
};
