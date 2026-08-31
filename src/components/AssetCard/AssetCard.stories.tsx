import type { Meta, StoryObj } from '@storybook/react-vite';
import { AssetCard } from './AssetCard';

const meta = {
  title: 'Components/AssetCard',
  component: AssetCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-chrome-surface p-8 w-60">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AssetCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A single AssetCard — the thumbnail is the bordered element, title/meta/
 * tags sit underneath it with no border of their own. `tags` render as
 * plain `#hashtag` text rather than pills.
 */
export const Default: Story = {
  args: {
    title: 'Bridging Figma and Code With AI Agents, Alone',
    meta: '24 Aug 2026',
    icon: 'code',
    tags: ['Agentic workflows', 'Design systems', 'Figma'],
    href: '#',
    children: (
      <div className="w-full h-full flex items-center justify-center bg-accent-subtle">
        <span className="text-2xl font-bold text-chrome-text-muted">GN</span>
      </div>
    ),
  },
};

/**
 * A stack of AssetCards, the layout it's designed for — a narrow rail list
 * (e.g. CanvasRail's "Pages" section or Home's recent-posts list).
 */
export const Stack: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <AssetCard title="Squaring a Circle Line" meta="2 Jun 2026" icon="palette" tags={['UX', 'Public transit']} href="#">
        <div className="w-full h-full flex items-center justify-center bg-accent-subtle">
          <span className="text-2xl font-bold text-chrome-text-muted">UX</span>
        </div>
      </AssetCard>
      <AssetCard title="Building a Data Explorer Micro Frontend" meta="2 Mar 2026" icon="code" tags={['Web dev', 'Data viz']} href="#">
        <div className="w-full h-full flex items-center justify-center bg-secondary-subtle">
          <span className="text-2xl font-bold text-chrome-text-muted">WD</span>
        </div>
      </AssetCard>
    </div>
  ),
};
