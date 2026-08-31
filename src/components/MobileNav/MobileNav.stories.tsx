import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { MobileNav } from './MobileNav';
import { CanvasRail } from '@components/CanvasRail/CanvasRail';
import { RailSection } from '@components/RailSection/RailSection';
import { navItems, externalLinks } from '@components/SiteRail/__fixtures__';

const meta = {
  title: 'Components/Shell/MobileNav',
  component: MobileNav,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  tags: ['autodocs'],
  args: {
    items: navItems,
    externalLinks,
    siteName: 'Gestral UI',
  },
} satisfies Meta<typeof MobileNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Closed (default) state — just the slim top bar with the menu button, logo,
 * and site name. This is the entire chrome MobileNav adds to a page until the
 * user opens the drawer; below `md` it replaces the Shell's rails.
 */
export const Closed: Story = {};

/**
 * Open drawer — clicking the menu button slides in the expanded SiteRail as a
 * modal overlay with a scrim. Escape or clicking the scrim/close button
 * dismisses it; navigating from a drawer link also closes it.
 */
export const Open: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open navigation' }));

    const dialog = await canvas.findByRole('dialog', { name: 'Site navigation' });
    await expect(dialog).toBeVisible();
    await expect(canvas.getByRole('complementary', { name: 'Site navigation' })).toBeVisible();

    // Escape closes the drawer and the top bar remains.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(canvas.getByRole('button', { name: 'Open navigation' })).toBeVisible();
  },
};

/**
 * `secondaryRail` renders extra content alongside the expanded SiteRail in
 * the drawer — a CanvasRail composition here, so a section/leaf page's
 * mobile drawer can mirror the desktop Shell's collapsed-SiteRail-plus-
 * CanvasRail column instead of just the site-wide nav. Omit it (as `Open`
 * above does) for pages with nothing analogous to show, e.g. the home page.
 */
export const WithSecondaryRail: Story = {
  args: {
    secondaryRail: (
      <CanvasRail title="Gestral UI" subtitle="Blog" className="h-full shadow-xl">
        <RailSection label="Pages">
          <p className="px-3 text-sm text-chrome-text-muted">Full PreviewCards would render here.</p>
        </RailSection>
      </CanvasRail>
    ),
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open navigation' }));

    const dialog = await canvas.findByRole('dialog', { name: 'Site navigation' });
    await expect(dialog).toBeVisible();
    await expect(canvas.getByText('Pages')).toBeVisible();
  },
};
