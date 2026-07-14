import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { MobileNav } from './MobileNav';
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
