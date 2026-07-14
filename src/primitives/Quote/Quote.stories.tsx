import type { Meta, StoryObj } from '@storybook/react-vite';
import { Quote } from './Quote';

const meta = {
  title: 'Primitives/Quote',
  component: Quote,
  tags: ['autodocs'],
} satisfies Meta<typeof Quote>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default `user` icon beside a short attributed quote, e.g. a research
 * participant's verbatim in a findings write-up.
 */
export const Default: Story = {
  args: {
    children: 'I would trust the information more if I knew where it came from.',
  },
};

/**
 * `icon` and `textClassName` let the quote match its surrounding surface —
 * here, editorial secondary text color.
 */
export const EditorialSurface: Story = {
  args: {
    children: 'Where does the information come from, and how reliable is the answer?',
    textClassName: 'text-editorial-text-secondary',
  },
};
