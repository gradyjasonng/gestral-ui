import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-chrome-surface p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A single Card in isolation, with all optional fields (`description`,
 * `tags`) populated. Use this to check spacing and typography of one card
 * without grid context — e.g. when validating a design change in isolation.
 */
export const PostCard: Story = {
  args: {
    title: 'Sample Article One',
    description: 'A short case study exploring an interface problem.',
    date: '2 Jun 2026',
    palette: 'accent',
    icon: 'palette',
    categoryLabel: 'UX',
    tags: ['Transit'],
    href: '#',
  },
};

/**
 * A grid of Cards mixing both `palette` values ('accent' and 'secondary'),
 * with and without `tags`/`description`, to show how the component behaves
 * at realistic scale. This is the layout Card is designed for — an index or
 * archive page — rather than a single standalone card.
 */
export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-2 w-full">
      <Card title="Sample Article One" date="2 Jun 2026" palette="accent" icon="palette" categoryLabel="UX" href="#" description="A short case study exploring an interface problem." />
      <Card title="Sample Work Project" date="12 Jun 2025" palette="secondary" icon="code" categoryLabel="Web Dev" tags={['LLMs']} href="#" description="Integrating LLM-powered conversations into a rule-based chatbot." />
      <Card title="Sample Article Two" date="21 May 2026" palette="secondary" icon="code" categoryLabel="Web Dev" tags={['Game Design']} href="#" description="How a small side project created a unique UX problem." />
      <Card title="Sample Article Three" date="5 May 2026" palette="accent" href="#" description="A short reflection on a design topic." />
    </div>
  ),
};

/**
 * `date` omitted — the meta block simply collapses to title/description.
 * Use this for undated index items (e.g. playground experiments) where a
 * date would be noise rather than signal.
 */
export const Undated: Story = {
  args: {
    title: 'Sample Experiment',
    description: 'A small interactive toy with no meaningful publish date.',
    palette: 'secondary',
    tags: ['Playground'],
    href: '#',
  },
};

/**
 * Thumbnail area filled with arbitrary `children` rather than only an
 * `<img>` — here a plain colored block with centered text. Card doesn't
 * special-case images; whatever is passed as `children` is clipped
 * (`overflow-clip`) to the aspect-video wrapper, so oversized content is cut
 * off rather than reflowing the card.
 */
export const CustomThumbnail: Story = {
  name: 'Custom thumbnail',
  args: {
    title: 'Sample Work Project',
    description: 'Integrating LLM-powered conversations into a rule-based chatbot.',
    date: '12 Jun 2025',
    palette: 'secondary',
    tags: ['Product Design', 'LLMs'],
    href: '#',
    children: (
      <div className="w-full h-full flex items-center justify-center bg-accent-default">
        <span className="text-4xl font-bold text-chrome-surface">GN</span>
      </div>
    ),
  },
};
