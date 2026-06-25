import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mat } from './Mat';

const meta = {
  component: Mat,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Mat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    as: 'div',
  },
};

export const WithContent: Story = {
  args: {
    as: 'div',
    children: (
      <div style={{ padding: '2cm' }}>
        <p style={{ color: 'var(--color-marking)', fontFamily: 'var(--font-sans)' }}>
          Content placed on the mat.
        </p>
      </div>
    ),
  },
};
