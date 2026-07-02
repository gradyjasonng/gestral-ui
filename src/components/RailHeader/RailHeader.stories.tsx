import type { Meta, StoryObj } from '@storybook/react-vite';
import { RailHeader } from './RailHeader';
import { Icon } from '../../primitives/Icon/Icon';

const LogoPlaceholder = () => (
  <span className="w-5 h-5 rounded-sm bg-accent-default shrink-0" aria-hidden="true" />
);

const meta = {
  title: 'Components/Sidebar/RailHeader',
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

/** Collapsed SiteRail — logo only */
export const LogoOnly: Story = {
  args: {
    left: (
      <a href="/" aria-label="Home" className="flex items-center justify-center w-full h-full">
        <LogoPlaceholder />
      </a>
    ),
  },
};

/** Expanded SiteRail — logo + site name */
export const LogoWithTitle: Story = {
  args: {
    left: (
      <a href="/" aria-label="Home" className="flex items-center justify-center w-full h-full">
        <LogoPlaceholder />
      </a>
    ),
    title: 'Grady Ng',
  },
};

/** LeftRail — back button + site name + section */
export const WithBackButton: Story = {
  args: {
    left: (
      <a
        href="/blog"
        aria-label="Back to Blog"
        className="flex items-center justify-center w-full h-full text-chrome-text-muted hover:text-chrome-text-primary transition-colors duration-100"
      >
        <Icon name="chevron-left" size="xs" />
      </a>
    ),
    title: 'Grady Ng',
    subtitle: 'Blog',
  },
};
