import type { Meta, StoryObj } from '@storybook/react-vite';
import { RailHeader } from './RailHeader';

const LogoPlaceholder = () => (
  <span className="w-5 h-5 rounded-sm bg-accent-default shrink-0" aria-hidden="true" />
);

const meta = {
  title: 'Components/Shell/RailHeader',
  component: RailHeader,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-chrome-surface w-56 border border-chrome-border rounded">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RailHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Collapsed SiteRail state — only the `left` logo slot is populated, no
 * `title`/`subtitle`. Use this when the rail is narrow (icon-column width)
 * and there isn't room for text, since RailHeader only renders the
 * title/subtitle block when at least one of those props is set.
 */
export const LogoOnly: Story = {
  args: {
    left: (
      <a href="/" aria-label="Home" className="flex items-center justify-center w-full h-full">
        <LogoPlaceholder />
      </a>
    ),
  },
};

/**
 * Expanded SiteRail state — logo plus `title` (site name), no `subtitle`.
 * `title` renders in `displayMd` and truncates rather than wrapping, so
 * keep it short. Use this composition on the top-level SiteRail once it's
 * expanded to panel width.
 */
export const LogoWithTitle: Story = {
  args: {
    left: (
      <a href="/" aria-label="Home" className="flex items-center justify-center w-full h-full">
        <LogoPlaceholder />
      </a>
    ),
    title: 'Gestral UI',
  },
};

/**
 * CanvasRail composition — no `left` slot, just `title` and `subtitle`
 * (site name and current section). CanvasRail has no back button; use the
 * SiteRail to navigate between sections instead.
 */
export const TitleWithSubtitle: Story = {
  args: {
    title: 'Gestral UI',
    subtitle: 'Subtitle',
  },
};

/**
 * CanvasRail composition with a post thumbnail (`above`) — the same
 * thumbnail content `PreviewCard` uses, e.g. a post's `<img>`. Rendered
 * full-bleed against the rail's edges in a plain, non-interactive `Card`
 * (`aspect-video`) above the title/subtitle row; `className` only affects
 * that row, not the thumbnail banner.
 */
export const WithThumbnail: Story = {
  name: 'With thumbnail',
  args: {
    title: 'Gestral UI',
    subtitle: 'Subtitle',
    className: 'pl-sp-md',
    above: (
      <div className="w-full h-full flex items-center justify-center bg-accent-default">
        <span className="text-2xl font-bold text-chrome-surface">GN</span>
      </div>
    ),
  },
};
