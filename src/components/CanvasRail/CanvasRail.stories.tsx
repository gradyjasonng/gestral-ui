import type { Meta, StoryObj } from '@storybook/react-vite';
import { CanvasRail } from './CanvasRail';
import { RailSection } from '@components/RailSection/RailSection';
import { LayerList } from '@components/LayerList/LayerList';
import { MetaList } from '@components/MetaList/MetaList';

const meta = {
  title: 'Shell/CanvasRail',
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
 * Leaf page — site name/section header, a "Layers" table of contents with
 * the current heading marked `active: true`, and an "Info" metadata block.
 * CanvasRail itself is pure layout; the caller composes `RailSection`s from
 * `LayerList`/`MetaList` (or `PageList` for a "Pages" section) as children.
 * This is the composition to use on an actual content page (e.g. a blog
 * post), where readers need "where am I on this page" navigation alongside
 * the article's metadata.
 */
export const Default: Story = {
  args: {
    title: 'Page Title',
    subtitle: 'gestral.ui',
    children: (
      <>
        <RailSection label="Layers">
          <LayerList
            items={[
              { label: 'Introduction',              href: '#intro',      depth: 2, active: true },
              { label: 'The Problem',               href: '#problem',    depth: 2 },
              { label: 'Early attempts',            href: '#attempts',   depth: 3 },
              { label: 'A cleaner approach',        href: '#approach',   depth: 3 },
              { label: 'Conclusion',                href: '#conclusion', depth: 2 },
            ]}
          />
        </RailSection>
        <hr className="border-chrome-border" />
        <RailSection label="Info">
          <MetaList
            meta={[
              { key: 'Published',    value: 'June 2026' },
              { key: 'Reading time', value: '8 min' },
              { key: 'Tags',         value: ['design', 'systems', 'css'] },
            ]}
          />
        </RailSection>
      </>
    ),
  },
};
