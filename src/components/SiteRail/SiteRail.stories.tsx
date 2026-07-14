import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { SiteRail, type SiteRailExternalLink } from './SiteRail';
import { PreviewCard } from '@components/PreviewCard/PreviewCard';
import { navItems, externalLinks } from './__fixtures__';

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden="true">
    <path d="M12 2l2.9 6.6L22 9.3l-5 4.8 1.3 7.1L12 17.8l-6.3 3.4L7 14.1 2 9.3l7.1-.7z" />
  </svg>
);

const externalLinksWithPreview: SiteRailExternalLink[] = [
  {
    label: 'Inspect Element',
    href: '#',
    customIcon: <StarIcon />,
    preview: (
      <PreviewCard
        title="Inspect Element"
        description="A web game with puzzles only solvable using developer tools."
        palette="secondary"
        href="#"
        className="h-full"
      />
    ),
  },
  ...externalLinks,
];

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
  args: { items: navItems, externalLinks },
};

/**
 * `expanded` state — widens to `w-48`, swaps nav items to full horizontal
 * Buttons with visible labels, and shows `siteName` in the header. Use this
 * when there's enough horizontal space to justify labelled navigation, or
 * as the default state paired with a top-level index Page (no CanvasRail).
 */
export const Expanded: Story = {
  args: { items: navItems, externalLinks, siteName: 'Gestral UI', expanded: true },
};

/**
 * `externalLinks` renders a secondary set of links (individual pages,
 * external sites, or social profiles like GitHub/LinkedIn) after a divider,
 * below `items`, with an optional `externalLinksLabel` heading shown above
 * them when expanded. On a hover-capable pointer, a link with a `preview`
 * shows as a compact icon+label link that reveals it on hover/focus; on a
 * touch device (no hover), `preview` is rendered directly as the link
 * instead — both renderings exist in the DOM and are toggled purely by a
 * `(hover: hover)` media query, so no JS branching is involved. Links with
 * no `preview` (GitHub, LinkedIn here) just render the compact link
 * everywhere. Unlike `items`, this section renders even when collapsed.
 */
export const WithExternalLinks: Story = {
  args: {
    items: navItems,
    siteName: 'Gestral UI',
    expanded: true,
    externalLinks: externalLinksWithPreview,
    externalLinksLabel: 'Elsewhere on the web',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Inspect Element' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
  },
};

