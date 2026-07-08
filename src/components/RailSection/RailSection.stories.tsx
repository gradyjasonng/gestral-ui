import type { Meta, StoryObj } from '@storybook/react-vite';
import { RailSection } from './RailSection';
import { Stack, Button } from '@primitives';

const meta = {
  title: 'Components/Shell/RailSection',
  component: RailSection,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-chrome-surface w-56 border border-chrome-border rounded">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RailSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `label` renders as the eyebrow section heading, with arbitrary content
 * (typically a `Stack` of `Button`s) below it. This is the shared wrapper
 * behind every labelled group in `CanvasRail` (Layers, Info, Up Next) —
 * reach for it whenever a rail needs its own labelled section.
 */
export const Default: Story = {
  args: {
    label: 'Layers',
    children: (
      <Stack direction="col" gap="xs" padding="xs">
        <Button variant="horizontal" size="sm" href="#intro" active>
          Introduction
        </Button>
        <Button variant="horizontal" size="sm" href="#problem">
          The Problem
        </Button>
        <Button variant="horizontal" size="sm" href="#conclusion">
          Conclusion
        </Button>
      </Stack>
    ),
  },
};
