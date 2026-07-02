import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteRail } from './SiteRail';
import { PageRail } from '../PageRail/PageRail';
import { LeafPage } from '../PageRail/PageRail.stories';
import { Text } from '../../primitives/Text/Text';
import { navItems, footerItems } from './__fixtures__.tsx';

const meta = {
  title: 'Components/Sidebar/SiteRail',
  component: SiteRail,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof SiteRail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {
  args: { items: navItems, footerItems },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-canvas-surface" style={{ transform: 'translateZ(0)' }}>
        <Story />
        <div className="ml-12 p-12">
          <Text variant="bodySmall" className="text-canvas-text-secondary">Canvas content area</Text>
        </div>
      </div>
    ),
  ],
};

export const Expanded: Story = {
  args: { items: navItems, footerItems, siteName: 'Grady Ng', expanded: true },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-canvas-surface" style={{ transform: 'translateZ(0)' }}>
        <Story />
        <div className="ml-40 p-12">
          <Text variant="bodySmall" className="text-canvas-text-secondary">Canvas content area</Text>
        </div>
      </div>
    ),
  ],
};

/** Full two-column left panel as it appears on a blog post */
export const WithLeftRail: Story = {
  render: () => (
    <div className="min-h-screen bg-canvas-surface" style={{ transform: 'translateZ(0)' }}>
      <SiteRail items={navItems} footerItems={footerItems} siteName="Grady Ng" className="left-0" />
      <PageRail {...LeafPage.args!} className="left-12" />
      <div className="ml-[268px] p-12">
        <p className="font-ui text-sm text-canvas-text-secondary">Canvas content area</p>
      </div>
    </div>
  ),
};
