import type { Meta, StoryObj } from '@storybook/react-vite';
import { Canvas } from './Canvas';
import { Text } from '@primitives';

const meta = {
  title: 'Components/Canvas',
  component: Canvas,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Canvas>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Empty artboard area, exactly as it renders by default inside a Shell before
 * any content is placed on it. Useful as a baseline for checking the canvas
 * background/scroll container in isolation, without Artboard children
 * competing for attention.
 */
export const Empty: Story = {
  render: () => (
    <div className="h-screen">
      <Canvas />
    </div>
  ),
};

/**
 * Canvas with simple text content instead of Artboards, to show that the
 * component doesn't require Artboard children — any content can be dropped
 * in directly, e.g. for a lighter-weight page that doesn't need the
 * frame-label/hover treatment.
 */
export const WithContent: Story = {
  render: () => (
    <div className="h-screen">
      <Canvas className="p-12">
        <Text variant="bodySmall" className="text-canvas-text-secondary">Canvas content area</Text>
      </Canvas>
    </div>
  ),
};
