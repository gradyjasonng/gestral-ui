import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-canvas-surface p-8 max-w-xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BlogCard: Story = {
  args: {
    title: 'Squaring a Circle Line',
    description: 'A small exercise around the UX of public transit wayfinding.',
    date: '2 Jun 2026',
    category: 'blog',
    tags: ['UX Design', 'Transit'],
    layerName: 'squaring-a-circle-line',
    href: '#',
  },
};

export const WorkCard: Story = {
  args: {
    title: 'Ask Fora Health',
    description: 'Integrating LLM-powered conversations into a rule-based chatbot.',
    date: '12 Jun 2025',
    category: 'work',
    tags: ['Product Design', 'LLMs'],
    layerName: 'ask-fora-health',
    href: '#',
  },
};

export const NoThumbnailNoTags: Story = {
  args: {
    title: 'On Obsolescence',
    description: 'A personal reflection on being replaced.',
    date: '5 May 2026',
    category: 'blog',
    href: '#',
  },
};

export const Grid: Story = {
  decorators: [
    (Story) => (
      <div className="bg-canvas-surface p-8">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="grid grid-cols-2 gap-8 max-w-2xl">
      <Card title="Squaring a Circle Line" date="2 Jun 2026" category="blog" tags={['UX Design']} layerName="squaring-a-circle-line" href="#" description="A small exercise around the UX of public transit wayfinding." />
      <Card title="Ask Fora Health" date="12 Jun 2025" category="work" tags={['Product Design', 'LLMs']} layerName="ask-fora-health" href="#" description="Integrating LLM-powered conversations into a rule-based chatbot." />
      <Card title="The UX of a Dev Tools Game" date="21 May 2026" category="blog" tags={['Frontend', 'Game Design']} href="#" description="How Inspect Element created a unique UX problem." />
      <Card title="On Obsolescence" date="5 May 2026" category="blog" href="#" description="A personal reflection on being replaced." />
    </div>
  ),
};
