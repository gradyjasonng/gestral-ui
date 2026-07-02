import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FilterStrip } from './FilterStrip';

const options = [
  { value: 'all',  label: 'All' },
  { value: 'blog', label: 'Blog' },
  { value: 'work', label: 'Work' },
];

const meta = {
  title: 'Components/FilterStrip',
  component: FilterStrip,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-canvas-surface p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FilterStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('all');
    return <FilterStrip options={options} value={value} onChange={setValue} />;
  },
};

export const ActiveBlog: Story = {
  args: { options, value: 'blog', onChange: () => {} },
};

export const ActiveWork: Story = {
  args: { options, value: 'work', onChange: () => {} },
};
