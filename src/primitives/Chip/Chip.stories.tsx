import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from './Chip';
import { Text } from '../Text/Text';
import { Icon } from '../Icon/Icon';

const meta = {
  title: 'Primitives/Chip',
  component: Chip,
  tags: ['autodocs'],
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The three `active` states side by side: `active` (filled accent),
 * `active="secondary"` (muted fill, e.g. for a filter that's applied but
 * not the primary selection), and inactive (default). Use Chip for compact
 * filter/tag/category controls — e.g. filtering a Card grid by category.
 */
export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Chip active>Blog</Chip>
      <Chip active="secondary">Work</Chip>
      <Chip>Writing</Chip>
    </div>
  ),
};

/**
 * Chip with both an `icon` and label text — the icon renders inline before
 * the label in both active and inactive states. Use this when a leading
 * icon adds meaningful context (e.g. a star for "starred" items) beyond
 * what the label text alone conveys.
 */
export const WithIcon: Story = {
  name: 'With Icon',
  render: () => (
    <div className="flex items-center gap-2">
      <Chip icon={<Icon name="star" size="sm" />} active>Starred</Chip>
      <Chip icon={<Icon name="star" size="sm" />}>Starred</Chip>
    </div>
  ),
};

/**
 * `iconOnly` — the label is still passed as `children` but rendered visually
 * hidden (`sr-only`) rather than omitted, so screen readers still announce
 * it; pass `aria-label` too for redundancy/clarity. Reach for this in
 * tightly-packed toolbars where a full label chip would be too wide.
 */
export const IconOnly: Story = {
  name: 'Icon Only',
  render: () => (
    <div className="flex items-center gap-2">
      <Chip iconOnly icon={<Icon name="star" size="sm" />} active aria-label="Star (active)">Star</Chip>
      <Chip iconOnly icon={<Icon name="star" size="sm" />} aria-label="Star">Star</Chip>
    </div>
  ),
};

/**
 * All three `size` values (`sm`/`md`/`lg`) across active states and the
 * `iconOnly` form, to compare height/padding/text-size scaling together.
 * `md` is the default; reach for `sm` in dense toolbars and `lg` where
 * Chip needs to match larger surrounding UI.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s} className="flex items-center gap-2">
          <Text variant="caption" as="span" className="font-mono text-chrome-text-muted w-6">{s}</Text>
          <Chip size={s} active>Active</Chip>
          <Chip size={s} active="secondary">Secondary</Chip>
          <Chip size={s}>Inactive</Chip>
          <Chip size={s} iconOnly icon={<Icon name="star" size="sm" />} aria-label="Star">Star</Chip>
        </div>
      ))}
    </div>
  ),
};
