import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControl } from './SegmentedControl';

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-chrome-surface p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { label: 'Clockwise', value: 'spiral-cw' },
  { label: 'Anticlockwise', value: 'spiral-ccw' },
  { label: 'Clockwise Loop', value: 'loop-cw' },
  { label: 'Anticlockwise Loop', value: 'loop-ccw' },
];

/**
 * Default `input` palette — blue, the standard palette for form/interactive
 * controls. Uncontrolled (manages its own selection state).
 */
export const Input: Story = {
  args: {
    options,
    defaultValue: 'spiral-cw',
  },
};

/**
 * `accent` palette — the selected option uses the emerald `accent` color
 * scheme instead of `input`.
 */
export const Accent: Story = {
  args: {
    options,
    defaultValue: 'spiral-cw',
    palette: 'accent',
  },
};

/**
 * `secondary` palette — the selected option uses the violet `secondary`
 * color scheme instead of `input`.
 */
export const Secondary: Story = {
  args: {
    options,
    defaultValue: 'spiral-cw',
    palette: 'secondary',
  },
};

/**
 * All three `size`s (forwarded to the underlying `Chip`) side by side.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <SegmentedControl options={options} defaultValue="spiral-cw" size="sm" />
      <SegmentedControl options={options} defaultValue="spiral-cw" size="md" />
      <SegmentedControl options={options} defaultValue="spiral-cw" size="lg" />
    </div>
  ),
};
