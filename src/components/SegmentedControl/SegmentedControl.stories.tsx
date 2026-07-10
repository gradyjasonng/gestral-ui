import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
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

const iconOptions = [
  { label: 'Rotate CW', value: 'rotate-cw', icon: 'rotate-cw' as const },
  { label: 'Rotate CCW', value: 'rotate-ccw', icon: 'rotate-ccw' as const },
  { label: 'Refresh CW', value: 'refresh-cw', icon: 'refresh-cw' as const },
  { label: 'Refresh CCW', value: 'refresh-ccw', icon: 'refresh-ccw' as const },
];

/**
 * Each `option` can carry an `icon`, rendered leading the label inside the
 * underlying `Button` — same as passing `icon` to `Button` directly.
 */
export const WithIcons: Story = {
  name: 'With Icons',
  args: {
    options: iconOptions,
    defaultValue: 'rotate-cw',
  },
};

const visibilityOptions = [
  { label: 'Show', value: 'on', icon: 'eye' as const },
  { label: 'Hide', value: 'off', icon: 'eye-off' as const },
];

/**
 * `iconOnly` drops the visible label text — each option renders as a plain
 * icon button (`Button`'s `iconOnly` variant), with `option.label` used as
 * the `aria-label`/`title` instead. Every option needs an `icon` for this
 * to make sense.
 */
export const IconOnly: Story = {
  name: 'Icon Only',
  args: {
    options: visibilityOptions,
    defaultValue: 'on',
    iconOnly: true,
    onChange: fn(),
  },
  play: async ({ args, canvas }) => {
    const showButton = canvas.getByRole('button', { name: 'Show' });
    const hideButton = canvas.getByRole('button', { name: 'Hide' });
    await expect(showButton).toHaveAttribute('aria-pressed', 'true');
    await expect(hideButton).toHaveAttribute('aria-pressed', 'false');

    await hideButton.click();

    await expect(args.onChange).toHaveBeenCalledWith('off');
    await expect(hideButton).toHaveAttribute('aria-pressed', 'true');
    await expect(showButton).toHaveAttribute('aria-pressed', 'false');
  },
};
