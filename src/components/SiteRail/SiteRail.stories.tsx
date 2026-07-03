import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteRail } from './SiteRail';
import { CanvasRail } from '../CanvasRail/CanvasRail';
import { Default as CanvasRailDefault } from '../CanvasRail/CanvasRail.stories';
import { navItems, footerItems } from './__fixtures__.tsx';

const meta = {
  title: 'Components/Shell/SiteRail',
  component: SiteRail,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex h-screen bg-canvas-surface">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SiteRail>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default (collapsed) state — icon-only nav items rendered as
 * LabelledIconButtons in a narrow (`w-14`) rail. No `siteName` is passed
 * since it wouldn't render in this state anyway (RailHeader only shows
 * `title` when `expanded` is true). Use this as the default site-wide rail
 * footprint, expanding only when the user opts in or screen space allows.
 */
export const Collapsed: Story = {
  args: { items: navItems, footerItems },
};

/**
 * `expanded` state — widens to `w-48`, swaps nav items to full horizontal
 * Buttons with visible labels, and shows `siteName` in the header. Use this
 * when there's enough horizontal space to justify labelled navigation, or
 * as the default state paired with a top-level index Page (no CanvasRail).
 */
export const Expanded: Story = {
  args: { items: navItems, footerItems, siteName: 'Gestral UI', expanded: true },
};
