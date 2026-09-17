import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetaList } from './MetaList';

const meta = {
  title: 'Shell/MetaList',
  component: MetaList,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-chrome-surface p-4 w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MetaList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The "Info" block of a rail — two columns, label on the left and the value
 * on the right in a bordered display field. A list value (here, `Tags`)
 * renders as a wrapping cluster of pills in the value column instead.
 */
export const Default: Story = {
  args: {
    meta: [
      { key: 'Published', value: '5 Mar 2026' },
      { key: 'Reading time', value: '8 min read' },
      { key: 'Tags', value: ['design', 'systems', 'css'] },
    ],
  },
};

/**
 * Single-value rows only — every value sits in its own field, all aligned
 * to the same left edge regardless of label length.
 */
export const NoTags: Story = {
  args: {
    meta: [
      { key: 'Published', value: '5 Mar 2026' },
      { key: 'Reading time', value: '8 min read' },
      { key: 'Status', value: 'Draft' },
    ],
  },
};

/**
 * A long value truncates rather than widening the rail or wrapping.
 */
export const LongValue: Story = {
  args: {
    meta: [
      { key: 'Published', value: '5 Mar 2026' },
      { key: 'Source', value: 'observable-notebook-kit-micro-frontend-deploy' },
    ],
  },
};
