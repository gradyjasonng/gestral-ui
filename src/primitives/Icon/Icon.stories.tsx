import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import { Text } from '../Text/Text';

const meta = {
  title: 'Primitives/Icon',
  component: Icon,
  args: {
    name: 'home',
    size: 'md',
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Baseline Icon at its default size (`md`) with no `label`, meaning it's
 * `aria-hidden` by default. Use this for decorative icons that always
 * appear alongside visible text conveying the same meaning (e.g. inside a
 * Button or Chip that already has a label).
 */
export const Default: Story = {};

/**
 * All five `size` values (`xs` through `xl`), each mapped to a CSS custom
 * property (`--icon-size-{size}`) rather than a hardcoded pixel value, so
 * icon sizing stays in sync with the token scale. Pick the size that
 * matches the text/control it sits beside.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <Text variant="caption" as="span" className="font-mono text-chrome-text-muted w-6">{size}</Text>
          <Icon name="home" size={size} className="text-chrome-text-primary" />
        </div>
      ))}
    </div>
  ),
};

/**
 * Passing `label` makes the icon meaningful to assistive technology: it
 * gets `role="img"` and `aria-label` instead of `aria-hidden`. Use `label`
 * only when the icon carries meaning on its own with no adjacent text —
 * e.g. a standalone icon-only button — otherwise leave it unset to avoid
 * redundant announcements.
 */
export const Accessible: Story = {
  name: 'With Accessible Label',
  args: {
    name: 'home',
    label: 'Home',
  },
};

/**
 * Icon has no color of its own — it inherits `currentColor` from its
 * parent, so wrapping it in a `text-*` class controls its color. This is
 * why Icon can be dropped into accent, secondary, or primary text contexts
 * (as shown here) without any color prop on the component itself.
 */
export const ColorInheritance: Story = {
  name: 'Color Inheritance',
  render: () => (
    <div className="flex items-center gap-4">
      <span className="text-accent-default flex items-center gap-1">
        <Icon name="check" size="md" />
        <Text variant="caption" as="span">accent</Text>
      </span>
      <span className="text-chrome-text-secondary flex items-center gap-1">
        <Icon name="cog" size="md" />
        <Text variant="caption" as="span">secondary</Text>
      </span>
      <span className="text-chrome-text-primary flex items-center gap-1">
        <Icon name="user" size="md" />
        <Text variant="caption" as="span">primary</Text>
      </span>
    </div>
  ),
};

/**
 * A sample of the available `name` values rendered together — not the full
 * icon set, but enough to browse the visual style at a glance. Check
 * `Icon.tsx`'s `icons` map for the complete list of supported names before
 * using one that isn't shown here.
 */
export const Showcase: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 text-chrome-text-primary">
      {(['home', 'search', 'cog', 'user', 'folder', 'file', 'arrow-back', 'check', 'x', 'plus'] as const).map((name) => (
        <div key={name} className="flex flex-col items-center gap-1.5">
          <Icon name={name} size="lg" />
          <Text variant="caption" as="span" className="font-mono text-chrome-text-muted">{name}</Text>
        </div>
      ))}
    </div>
  ),
};
