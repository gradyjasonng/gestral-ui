import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { Text } from '../Text/Text';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `horizontal` variant — icon and label side by side, filling the width of
 * its container. This is the variant SiteRail uses in its `expanded` state
 * for nav items. `active`/`active="secondary"`/inactive states are all
 * shown here; `icon` is optional — the last example shows text-only usage.
 */
export const Horizontal: Story = {
  render: () => (
    <div className="w-48 flex flex-col gap-1">
      <Button variant="horizontal" icon="star" active>Active</Button>
      <Button variant="horizontal" icon="star" active="secondary">Secondary active</Button>
      <Button variant="horizontal" icon="star">Inactive</Button>
      <Button variant="horizontal">Text only</Button>
    </div>
  ),
};

/**
 * `vertical` variant — icon stacked above label, sized to content rather
 * than filling its container. Reach for this in narrower layouts where a
 * horizontal icon+label pairing wouldn't fit, but a label is still needed
 * (unlike `iconOnly`, which drops the label entirely).
 */
export const Vertical: Story = {
  render: () => (
    <div className="flex items-start gap-2">
      <Button variant="vertical" icon="star" active>Active</Button>
      <Button variant="vertical" icon="star" active="secondary">Secondary</Button>
      <Button variant="vertical" icon="star">Inactive</Button>
    </div>
  ),
};

/**
 * `iconOnly` variant — renders just the square icon fill via `IconFill`,
 * with no visible label. Since there's no text content for assistive tech
 * to read, always pass `aria-label` when using this variant, as shown here.
 * Use this in the most space-constrained layouts, e.g. a collapsed rail's
 * footer actions.
 */
export const IconOnly: Story = {
  name: 'Icon Only',
  render: () => (
    <div className="flex items-center gap-2">
      <Button variant="iconOnly" icon="star" active aria-label="Star (active)">Star</Button>
      <Button variant="iconOnly" icon="star" active="secondary" aria-label="Star (secondary)">Star</Button>
      <Button variant="iconOnly" icon="star" aria-label="Star">Star</Button>
    </div>
  ),
};

/**
 * All three `size` values (`sm`/`md`/`lg`) across all three variants, to
 * show how `size` scales padding, text size, and icon container height
 * together. `iconSize` can be set independently of `size` when an icon
 * needs to read at a different scale than the surrounding text/padding.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s} className="flex items-center gap-4">
          <Text variant="caption" as="span" className="font-mono text-chrome-text-muted w-6">{s}</Text>
          <Button variant="horizontal" size={s} icon="star" active>Horizontal</Button>
          <Button variant="vertical" size={s} icon="star">Vertical</Button>
          <Button variant="iconOnly" size={s} icon="star" aria-label="Star">Star</Button>
          <div className="w-40">
            <Button variant="horizontal" size={s}>Text only</Button>
          </div>
        </div>
      ))}
    </div>
  ),
};
