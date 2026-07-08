import type { Meta, StoryObj } from '@storybook/react-vite';
import { CanvasRail } from './CanvasRail';

const meta = {
  title: 'Components/Shell/CanvasRail',
  component: CanvasRail,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex h-screen bg-canvas-surface">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CanvasRail>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Leaf page — site name/section header, a table of contents with the
 * current heading marked `active: true`, and metadata. This is the
 * composition to use on an actual content page (e.g. a blog post), where
 * readers need "where am I on this page" navigation alongside the article's
 * metadata.
 */
export const Default: Story = {
  args: {
    title: 'Page Title',
    subtitle: 'gestral.ui',
    items: [
      { label: 'Introduction',              href: '#intro',      depth: 2, active: true },
      { label: 'The Problem',               href: '#problem',    depth: 2 },
      { label: 'Early attempts',            href: '#attempts',   depth: 3 },
      { label: 'A cleaner approach',        href: '#approach',   depth: 3 },
      { label: 'Conclusion',                href: '#conclusion', depth: 2 },
    ],
    meta: [
      { key: 'Published',    value: 'June 2026' },
      { key: 'Reading time', value: '8 min' },
      { key: 'Tags',         value: ['design', 'systems', 'css'] },
    ],
  },
};
