import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { MobileNav } from './MobileNav';
import { Rail } from '@components/Rail/Rail';
import { Stack } from '@primitives';
import type { SiteRailItem } from '@components/SiteRail/SiteRail';

// Blog/Work intercept their own click so tapping them opens the drawer
// instead of navigating; Home is left to the logo, so it isn't in the bar.
const navItems: SiteRailItem[] = [
  { label: 'Blog', href: '/blog', icon: 'pencil', active: 'secondary', onClick: (e) => e.preventDefault() },
  { label: 'Work', href: '/work', icon: 'briefcase', onClick: (e) => e.preventDefault() },
];

const sectionCards = (
  <Rail aria-label="Section pages" className="w-72 border-r-0 border-l shadow-xl">
    <Stack direction="col" gap="lg" className="px-sp-md pt-16 pb-20">
      <div className="aspect-video shrink-0 rounded-lg bg-chrome-surface-hover" />
      <div className="aspect-video shrink-0 rounded-lg bg-chrome-surface-hover" />
      <div className="aspect-video shrink-0 rounded-lg bg-chrome-surface-hover" />
    </Stack>
  </Rail>
);

const meta = {
  title: 'Shell/MobileNav',
  component: MobileNav,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  tags: ['autodocs'],
  args: {
    items: navItems,
    siteName: 'Gestral UI',
    subtitle: 'Blog',
  },
} satisfies Meta<typeof MobileNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Just the slim top bar: the logo (a Home link), the site name plus section
 * subtitle, and the section nav as icon+label buttons. This is the entire
 * chrome MobileNav adds to a page until a nav button opens the drawer;
 * below `md` it replaces the Shell's rails.
 */
export const Closed: Story = {};

/**
 * The bar is `sticky` to the viewport top, so it stays put while the page
 * scrolls beneath it. Scroll this story to see the bar hold while the
 * placeholder content moves.
 */
export const Sticky: Story = {
  decorators: [
    (Story) => (
      <div>
        <Story />
        <Stack direction="col" gap="lg" className="p-4">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="h-40 shrink-0 rounded-lg bg-chrome-surface-hover" />
          ))}
        </Stack>
      </div>
    ),
  ],
};

/**
 * Tapping a section button whose `onClick` calls `preventDefault()` slides
 * the section rail in from the right as a modal drawer, instead of
 * navigating — the same nav buttons poke through onto the sheet, with the
 * close button at the bottom-right. Escape, the scrim, the close button, or
 * tapping the open section's button again dismisses it and fires `onClose`.
 */
export const OpenDrawer: Story = {
  args: { secondaryRail: sectionCards, onClose: fn() },
  play: async ({ args, canvas }) => {
    const blogLink = () => canvas.getAllByRole('link', { name: 'Blog' })[0];

    await userEvent.click(blogLink());
    const dialog = await canvas.findByRole('dialog', { name: 'Section navigation' });
    await expect(dialog).toBeVisible();
    // The nav buttons now show in both the bar and the drawer.
    await expect(canvas.getAllByRole('link', { name: 'Blog' })).toHaveLength(2);

    // Escape dismisses it and reports the abandoned preview via onClose.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(args.onClose).toHaveBeenCalledTimes(1);

    // Re-open, then the bottom-right close button dismisses it too.
    await userEvent.click(blogLink());
    await expect(await canvas.findByRole('dialog')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Close navigation' }));
    await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(args.onClose).toHaveBeenCalledTimes(2);
  },
};
