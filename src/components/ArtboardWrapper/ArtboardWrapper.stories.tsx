import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArtboardWrapper } from './ArtboardWrapper';

const meta = {
  title: 'Components/ArtboardWrapper',
  component: ArtboardWrapper,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-canvas-surface p-12 max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ArtboardWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'ask-fora-health',
    children: (
      <div className="w-full h-64 flex items-center justify-center bg-chrome-surface">
        <span className="font-ui text-sm text-canvas-text-muted">Figma embed</span>
      </div>
    ),
  },
};

export const WithIframe: Story = {
  args: {
    label: 'prototype-v2',
    children: (
      <iframe
        className="w-full"
        height={400}
        src="about:blank"
        title="Figma prototype"
      />
    ),
  },
};
