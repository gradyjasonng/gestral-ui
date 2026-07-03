import type { Meta, StoryObj } from '@storybook/react-vite';
import { Page } from './Page';
import { Text } from '../../primitives/Text/Text';
import { Grid as CardGrid } from '../Card/Card.stories';

const meta = {
  title: 'Components/Page',
  component: Page,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

const placeholder = (
  <>
    <Text variant="hero" className="text-chrome-text-primary mt-20">
      Page Title
    </Text>
    <Text variant="subheading2" className="text-chrome-text-primary mb-stack-lg">
      Subtitle
    </Text>
    <CardGrid.render />
  </>
);

/**
 * Sensible default width (`w-[960px]`, capped by `max-w-full` so it never
 * overflows a narrow viewport). This is the layout to use for top-level
 * index pages (Home/Blog/Work) — it pairs with an expanded SiteRail and no
 * CanvasRail, unlike Artboard-based leaf pages which use Canvas instead.
 */
export const Default: Story = {
  args: {
    children: placeholder,
  },
};

/**
 * Overrides the default width cap via `className="w-full"` for full-bleed
 * content that should span the viewport instead of being centered at
 * `960px` — reach for this when a page section (e.g. a hero image or grid)
 * needs to extend edge to edge.
 */
export const FullBleed: Story = {
  args: {
    className: 'w-full',
    children: placeholder,
  },
};
