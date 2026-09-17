import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { PageList } from './PageList';
import { AssetCard } from '@components/AssetCard/AssetCard';

const meta = {
  title: 'Shell/PageList',
  component: PageList,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-chrome-surface p-4 w-60">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PageList>;

export default meta;
type Story = StoryObj<typeof meta>;

const thumbnail = (
  <div className="w-full h-full flex items-center justify-center bg-accent-subtle">
    <span className="text-2xl font-bold text-chrome-text-muted">GN</span>
  </div>
);

/**
 * A short list of sibling pages, no pagination needed. The active entry
 * ("Squaring a Circle Line") is the current page: a plain bolded label with
 * no link and no hover/focus preview, while every other entry is a link
 * that reveals its `previewCard`. With only two entries, the list is padded
 * with blank rows to its fixed `pageSize` (6) height.
 */
export const Default: Story = {
  args: {
    pages: [
      {
        label: 'Squaring a Circle Line',
        href: '#',
        active: true,
        previewCard: <AssetCard title="Squaring a Circle Line" date="2 Jun 2026" icon="palette" href="#">{thumbnail}</AssetCard>,
      },
      {
        label: 'The UX of a Dev Tools Game',
        href: '#',
        previewCard: <AssetCard title="The UX of a Dev Tools Game" date="21 May 2026" icon="code" href="#">{thumbnail}</AssetCard>,
      },
    ],
  },
  play: async ({ canvas }) => {
    // The active row is inert: a <span> marked aria-current, not a link.
    const activeRow = canvas.getByText('Squaring a Circle Line').closest('[aria-current="page"]');
    await expect(activeRow).not.toBeNull();
    await expect(activeRow!.tagName).toBe('SPAN');
    await expect(activeRow!.closest('a')).toBeNull();

    // Sibling rows stay navigable links.
    const siblingLinks = canvas.getAllByRole('link', { name: 'The UX of a Dev Tools Game' });
    await expect(siblingLinks.length).toBeGreaterThan(0);
  },
};

/**
 * More entries than `pageSize` — pagination controls appear, and since the
 * `active` entry is on page 2, the list opens there instead of page 1.
 */
export const PaginatedOpensToActivePage: Story = {
  name: 'Paginated, opens to active page',
  args: {
    pageSize: 2,
    pages: Array.from({ length: 5 }, (_, i) => ({
      label: `Sample Post ${i + 1}`,
      href: `#${i}`,
      active: i === 3,
      previewCard: <AssetCard title={`Sample Post ${i + 1}`} date="2026" icon="palette" href={`#${i}`}>{thumbnail}</AssetCard>,
    })),
  },
};
