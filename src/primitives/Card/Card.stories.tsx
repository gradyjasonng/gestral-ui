import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Text } from '@primitives/Text/Text';

const meta = {
  title: 'Primitives/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The three `elevation` tiers side by side: `flat` (border only, sits on the
 * page), `raised`, and `floating` (deepest shadow, e.g. a dragged item or a
 * menu). Each is a plain, non-interactive `<div>` here.
 */
export const Elevation: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(['flat', 'raised', 'floating'] as const).map((elevation) => (
        <Card key={elevation} elevation={elevation} className="w-40 h-24 p-4">
          <Text variant="caption" className="text-chrome-text-secondary">{elevation}</Text>
        </Card>
      ))}
    </div>
  ),
};

/**
 * Interactivity is inferred from `href`/`onClick`, not an explicit prop —
 * only these two get the `selection-blue` hover border and pointer cursor.
 * A plain Card (no `href`/`onClick`) renders as a `<div>` with neither.
 */
export const Interactive: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Card href="#" className="w-40 h-24 p-4">
        <Text variant="caption" className="text-chrome-text-secondary">href (renders &lt;a&gt;)</Text>
      </Card>
      <Card onClick={() => {}} className="w-40 h-24 p-4">
        <Text variant="caption" className="text-chrome-text-secondary">onClick (renders &lt;button&gt;)</Text>
      </Card>
      <Card className="w-40 h-24 p-4">
        <Text variant="caption" className="text-chrome-text-secondary">neither (renders &lt;div&gt;)</Text>
      </Card>
    </div>
  ),
};
