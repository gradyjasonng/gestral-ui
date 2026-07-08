import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { SiteRail } from './SiteRail';
import { CanvasRail } from '@components/CanvasRail/CanvasRail';
import { Default as CanvasRailDefault } from '@components/CanvasRail/CanvasRail.stories';
import { navItems, footerItems } from './__fixtures__';
import { ARTBOARD_FRAME_STORAGE_KEY } from '@lib/artboardFrame';

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

/**
 * The rail footer always includes a frame-toggle icon button (alongside any
 * caller-supplied `footerItems`), which flips `data-artboard-frame` on
 * `<html>` and persists the choice to localStorage — that's what every
 * Artboard on the page reads to hide its label/border, see `global.css`.
 */
export const FrameToggle: Story = {
  args: { items: navItems, footerItems },
  beforeEach: () => {
    window.localStorage.removeItem(ARTBOARD_FRAME_STORAGE_KEY);
    document.documentElement.removeAttribute('data-artboard-frame');
  },
  play: async ({ canvas }) => {
    const button = await canvas.findByRole('button', { name: 'Hide frames' });
    await expect(document.documentElement).not.toHaveAttribute('data-artboard-frame');

    button.click();
    await expect(await canvas.findByRole('button', { name: 'Show frames' })).toBeInTheDocument();
    await expect(document.documentElement).toHaveAttribute('data-artboard-frame', 'off');
    await expect(window.localStorage.getItem(ARTBOARD_FRAME_STORAGE_KEY)).toBe('off');

    (await canvas.findByRole('button', { name: 'Show frames' })).click();
    await expect(await canvas.findByRole('button', { name: 'Hide frames' })).toBeInTheDocument();
    await expect(document.documentElement).toHaveAttribute('data-artboard-frame', 'on');
  },
};
