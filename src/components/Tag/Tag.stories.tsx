import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';

const meta = {
  title: 'Content/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: { children: 'Design systems' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `floating` (default) — an opaque `chrome-surface` fill plus a drop
 * shadow, so it stays legible sitting over arbitrary imagery. This is what
 * `ThumbnailChips` uses for a card's date and tag overlays. Shown here on a
 * colour block to make the fill and shadow read.
 */
export const Floating: Story = {
  decorators: [
    (Story) => (
      <div className="bg-accent-subtle p-8">
        <Story />
      </div>
    ),
  ],
};

/**
 * `inset` — a plain border, no fill or shadow, for sitting inside a
 * surface-coloured panel. This is what `MetaList` uses for its values.
 */
export const Inset: Story = {
  args: { variant: 'inset' },
  decorators: [
    (Story) => (
      <div className="bg-chrome-surface p-8">
        <Story />
      </div>
    ),
  ],
};

/**
 * The three variants side by side — same type, size and padding; only
 * the fill/border/shadow differ.
 */
export const BothVariants: Story = {
  render: () => (
    <div className="bg-chrome-surface p-8 flex gap-3">
      <Tag variant="floating">2 Jun 2026</Tag>
      <Tag variant="inset">2 Jun 2026</Tag>
      <Tag variant="solid">2 Jun 2026</Tag>
    </div>
  ),
};

/**
 * `solid` — an opaque colour fill with white text, for a called-out
 * annotation rather than metadata (e.g. `Connector`'s on-line label).
 * `palette` picks the fill: `chrome` (default, a neutral emphasis fill) or
 * the `emerald`/`blue`/`purple` "selection" colours `Artboard`/`Connector`
 * use to hint at a kind of content.
 */
export const Solid: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(['chrome', 'emerald', 'blue', 'purple'] as const).map((palette) => (
        <Tag key={palette} variant="solid" palette={palette}>
          {palette}
        </Tag>
      ))}
    </div>
  ),
};
