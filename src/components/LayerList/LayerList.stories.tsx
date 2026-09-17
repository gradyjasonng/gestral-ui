import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayerList } from './LayerList';

const meta = {
  title: 'Shell/LayerList',
  component: LayerList,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-chrome-surface p-4 w-60">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LayerList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A page's table of contents, nested via `depth` (mirrors markdown heading
 * depth, e.g. h2/h3, but also fits arbitrarily nested Artboards) — the
 * current section marked `active`. Every row leads with a frame icon, to
 * echo the Figma "Layers" / Artboard metaphor.
 */
export const Default: Story = {
  args: {
    items: [
      { label: 'Introduction',        href: '#intro',      depth: 2, active: true },
      { label: 'The Problem',         href: '#problem',    depth: 2 },
      { label: 'Early attempts',      href: '#attempts',   depth: 3 },
      { label: 'A cleaner approach',  href: '#approach',   depth: 3 },
      { label: 'Conclusion',          href: '#conclusion', depth: 2 },
    ],
  },
};

/**
 * Any row can swap the default frame for its own `icon` — e.g. to flag a
 * live demo or an image-only Artboard as something other than prose.
 */
export const PerItemIconOverride: Story = {
  args: {
    items: [
      { label: 'Overview',       href: '#overview', depth: 2, active: true },
      { label: 'Try it live',    href: '#demo',     depth: 2, icon: 'code' },
      { label: 'The gallery',    href: '#gallery',  depth: 2, icon: 'palette' },
      { label: 'How it works',   href: '#how',      depth: 2 },
    ],
  },
};
