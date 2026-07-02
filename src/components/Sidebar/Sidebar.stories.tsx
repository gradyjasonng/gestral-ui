import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar } from './Sidebar';
import { SiteRail } from '../SiteRail/SiteRail';
import { PageRail } from '../PageRail/PageRail';
import { navItems, footerItems } from '../SiteRail/__fixtures__.tsx';
import { LeafPage } from '../PageRail/PageRail.stories';
import { Text } from '../../primitives/Text/Text';

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const CanvasContent = ({ offset }: { offset: string }) => (
  <div className={`${offset} min-h-screen bg-canvas-surface p-12`}>
    <Text variant="bodySmall" className="text-canvas-text-secondary">Canvas content area</Text>
  </div>
);

/** SiteRail only — collapsed, no section */
export const CollapsedOnly: Story = {
  render: () => (
    <div className="min-h-screen bg-canvas-surface">
      <Sidebar
        main={<SiteRail items={navItems} footerItems={footerItems} siteName="Grady Ng" fixed={false} />}
      />
      <CanvasContent offset="ml-12" />
    </div>
  ),
};

/** SiteRail expanded with labels */
export const ExpandedOnly: Story = {
  render: () => (
    <div className="min-h-screen bg-canvas-surface">
      <Sidebar
        main={<SiteRail items={navItems} footerItems={footerItems} siteName="Grady Ng" expanded fixed={false} />}
      />
      <CanvasContent offset="ml-40" />
    </div>
  ),
};

/** Full leaf page — SiteRail + PageRail with pages, TOC, meta, and spanning footer */
export const LeafPageStory: Story = {
  name: 'Leaf Page',
  render: () => (
    <div className="min-h-screen bg-canvas-surface">
      <Sidebar
        main={
          <>
            <SiteRail items={navItems} footerItems={footerItems} siteName="Grady Ng" fixed={false} />
            <PageRail {...LeafPage.args!} fixed={false} />
          </>
        }
      />
      <CanvasContent offset="ml-[268px]" />
    </div>
  ),
};
