import type { Meta, StoryObj } from '@storybook/react-vite';
import { PreviewCard } from './PreviewCard';

const meta = {
  title: 'Components/PreviewCard',
  component: PreviewCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-chrome-surface p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PreviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A single PreviewCard in isolation, with all optional fields (`description`,
 * `tags`) populated. Use this to check spacing and typography of one card
 * without grid context — e.g. when validating a design change in isolation.
 */
export const PostCard: Story = {
  args: {
    title: 'Sample Article One',
    description: 'A short case study exploring an interface problem.',
    className: 'aspect-4/3 w-120',
    date: '2 Jun 2026',
    palette: 'accent',
    icon: 'palette',
    categoryLabel: 'UX',
    tags: ['Transit'],
    href: '#',
  },
};

/**
 * A grid of PreviewCards mixing both `palette` values ('accent' and 'secondary'),
 * with and without `tags`/`description`, to show how the component behaves
 * at realistic scale. This is the layout PreviewCard is designed for — an index or
 * archive page — rather than a single standalone card.
 */
export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-2 w-full *:aspect-4/3">
      <PreviewCard title="Sample Article One" date="2 Jun 2026" palette="accent" icon="palette" categoryLabel="UX" href="#" />
      <PreviewCard title="Sample Work Project" date="12 Jun 2025" palette="secondary" icon="code" categoryLabel="Web Dev" tags={['LLMs']} href="#" />
      <PreviewCard title="Sample Article Two" date="21 May 2026" palette="secondary" icon="code" categoryLabel="Web Dev" tags={['Game Design']} href="#" />
      <PreviewCard title="Sample Article Three" date="5 May 2026" palette="accent" href="#" />
    </div>
  ),
};

/**
 * Thumbnail area filled with arbitrary `children` rather than only an
 * `<img>` — here a plain colored block with centered text. PreviewCard doesn't
 * special-case images; whatever is passed as `children` is clipped
 * (`overflow-clip`) to the aspect-video wrapper, so oversized content is cut
 * off rather than reflowing the card.
 */
/**
 * `layout="horizontal"` — a fixed-size thumbnail beside title/description/meta,
 * spanning the full width of its container instead of sitting in a grid cell.
 * Use this where an index needs to surface more metadata than a dense grid
 * card allows (e.g. a case-study listing with role/timeline). `meta` renders
 * as an extra caption line joined with `date` via " · ".
 */
export const Horizontal: Story = {
  args: {
    layout: 'horizontal',
    title: 'Ask Fora Health',
    description: 'Integrating LLM-powered answers into a rule-based healthcare chatbot, without spending the trust the rule-based system was built to earn.',
    date: 'Late 2024 – 2025',
    meta: 'Product Designer',
    palette: 'secondary',
    icon: 'palette',
    categoryLabel: 'Product Design',
    tags: ['Healthcare', 'Generative AI'],
    href: '#',
    children: (
      <div className="w-full h-full flex items-center justify-center bg-secondary-default">
        <span className="text-4xl font-bold text-chrome-surface">GN</span>
      </div>
    ),
  },
};

/**
 * A stack of `horizontal` PreviewCards, the layout it's designed for — a
 * full-width listing rather than a grid.
 */
export const HorizontalStack: Story = {
  name: 'Horizontal stack',
  render: () => (
    <div className="flex flex-col gap-4 w-full">
      <PreviewCard
        layout="horizontal"
        title="Ask Fora Health"
        description="Integrating LLM-powered answers into a rule-based healthcare chatbot, without spending the trust the rule-based system was built to earn."
        date="Late 2024 – 2025"
        meta="Product Designer"
        palette="secondary"
        categoryLabel="Product Design"
        tags={['Healthcare', 'Generative AI']}
        href="#"
      />
      <PreviewCard
        layout="horizontal"
        title="Sample Work Project"
        description="A second case study, to show how the stack reads with more than one entry."
        date="2023 – 2024"
        meta="Design Engineer"
        palette="secondary"
        categoryLabel="Web Dev"
        tags={['Design Systems']}
        href="#"
      />
    </div>
  ),
};

export const CustomThumbnail: Story = {
  name: 'Custom thumbnail',
  args: {
    title: 'Sample Work Project',
    description: 'Integrating LLM-powered conversations into a rule-based chatbot.',
    date: '12 Jun 2025',
    palette: 'secondary',
    tags: ['Product Design', 'LLMs'],
    href: '#',
    className: 'aspect-4/3 w-120',
    children: (
      <div className="w-full h-full flex items-center justify-center bg-accent-default">
        <span className="text-4xl font-bold text-chrome-surface">GN</span>
      </div>
    ),
  },
};
