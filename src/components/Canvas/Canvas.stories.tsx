import type { Meta, StoryObj } from '@storybook/react-vite';
import { Canvas } from './Canvas';
import { Text } from '../../primitives/Text/Text';
import { Stack } from '../../primitives/Stack/Stack';
import { Artboard } from '../Artboard/Artboard';
import {
  Default as ArtboardDefault,
  Interactive as ArtboardInteractive,
  External as ArtboardExternal,
} from '../Artboard/Artboard.stories';

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

/**
 * A fake page composed from the Artboard stories, stacked vertically by the
 * caller via a `Stack`. Canvas itself has no opinion on layout — it's just a
 * scroll/zoom container — so arranging children (direction, gap) is entirely
 * up to whatever's placed inside it. This is the composition to reach for
 * when artboards represent sections of a single scrolling page. Try
 * pinch-zooming — the scale applies inside the canvas rather than zooming
 * the browser page, since Canvas intercepts ctrl+wheel events itself.
 */
export const VerticalPage: Story = {
  name: 'Vertical page',
  render: () => (
    <div className="h-screen">
      <Canvas className="p-12">
        <Stack direction="col" gap="lg">
          <Artboard {...ArtboardDefault.args!} />
          <Artboard {...ArtboardInteractive.args!} />
          <Artboard {...ArtboardExternal.args!} />
        </Stack>
      </Canvas>
    </div>
  ),
};

/**
 * The same fake page, laid out horizontally instead by swapping the
 * caller's `Stack` to `direction="row"`. Use this orientation when
 * artboards represent parallel/alternative views (e.g. variant comparisons)
 * rather than a single vertical scroll.
 */
export const HorizontalPage: Story = {
  name: 'Horizontal page',
  render: () => (
    <div className="h-screen">
      <Canvas className="p-12">
        <Stack direction="row" gap="lg">
          <Artboard {...ArtboardDefault.args!} />
          <Artboard {...ArtboardInteractive.args!} />
          <Artboard {...ArtboardExternal.args!} />
        </Stack>
      </Canvas>
    </div>
  ),
};
