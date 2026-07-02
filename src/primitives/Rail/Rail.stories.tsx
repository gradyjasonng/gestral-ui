import type { Meta, StoryObj } from '@storybook/react-vite';
import { Rail } from './Rail';
import { Text } from '../Text/Text';

const meta = {
  title: 'Primitives/Rail',
  component: Rail,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Rail>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaceholderItem({ wide = false }: { wide?: boolean }) {
  return (
    <div
      className={
        wide
          ? 'h-7 mx-2 rounded-sm bg-chrome-border opacity-40'
          : 'w-8 h-8 rounded-sm bg-chrome-border opacity-40 mx-auto'
      }
    />
  );
}

function PlaceholderHeader({ wide = false }: { wide?: boolean }) {
  return (
    <div className="min-h-12 border-b border-chrome-border flex items-center px-3 gap-2 shrink-0">
      <div className="w-5 h-5 rounded-sm bg-chrome-border opacity-60 shrink-0" />
      {wide && <div className="h-3 rounded-sm bg-chrome-border opacity-40 flex-1" />}
    </div>
  );
}

/** Narrow (w-12) — icon-column width, the default SiteRail collapsed state */
export const Narrow: Story = {
  render: () => (
    <div className="min-h-screen bg-canvas-surface" style={{ transform: 'translateZ(0)' }}>
      <Rail width="w-12" aria-label="Narrow rail" className="left-0">
        <PlaceholderHeader />
        <div className="flex flex-col items-center gap-1 py-2">
          <PlaceholderItem />
          <PlaceholderItem />
          <PlaceholderItem />
        </div>
      </Rail>
      <div className="ml-12 p-12">
        <Text variant="bodySmall" className="text-canvas-text-secondary">Canvas content area</Text>
      </div>
    </div>
  ),
};

/** Wide (w-[220px]) — panel width, the LeftRail footprint */
export const Wide: Story = {
  render: () => (
    <div className="min-h-screen bg-canvas-surface" style={{ transform: 'translateZ(0)' }}>
      <Rail width="w-[220px]" aria-label="Wide rail" className="left-0">
        <PlaceholderHeader wide />
        <div className="flex flex-col gap-1 py-2 px-2">
          <PlaceholderItem wide />
          <PlaceholderItem wide />
          <PlaceholderItem wide />
          <PlaceholderItem wide />
        </div>
      </Rail>
      <div className="ml-[220px] p-12">
        <Text variant="bodySmall" className="text-canvas-text-secondary">Canvas content area</Text>
      </div>
    </div>
  ),
};

/** Two rails side by side — the SiteRail + LeftRail composition pattern */
export const Compound: Story = {
  render: () => (
    <div className="min-h-screen bg-canvas-surface" style={{ transform: 'translateZ(0)' }}>
      <Rail width="w-12" aria-label="Primary rail" className="left-0">
        <PlaceholderHeader />
        <div className="flex flex-col items-center gap-1 py-2">
          <PlaceholderItem />
          <PlaceholderItem />
          <PlaceholderItem />
        </div>
      </Rail>
      <Rail width="w-[220px]" aria-label="Secondary rail" className="left-12">
        <PlaceholderHeader wide />
        <div className="flex flex-col gap-1 py-2 px-2">
          <PlaceholderItem wide />
          <PlaceholderItem wide />
          <PlaceholderItem wide />
        </div>
      </Rail>
      <div className="ml-[268px] p-12">
        <Text variant="bodySmall" className="text-canvas-text-secondary">Canvas content area</Text>
      </div>
    </div>
  ),
};
