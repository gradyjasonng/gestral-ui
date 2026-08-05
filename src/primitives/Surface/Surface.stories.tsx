import type { Meta, StoryObj } from '@storybook/react-vite';
import { Surface } from './Surface';
import { Text } from '@primitives/Text/Text';

const meta = {
  title: 'Primitives/Surface',
  component: Surface,
  tags: ['autodocs'],
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The three `elevation` tiers side by side: `flat` (border only, sits on the
 * page), `raised`, and `floating` (deepest shadow, e.g. a dragged item or a
 * menu).
 */
export const Elevation: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(['flat', 'raised', 'floating'] as const).map((elevation) => (
        <Surface key={elevation} elevation={elevation} className="w-40 h-24 p-4 rounded-lg">
          <Text variant="caption">{elevation}</Text>
        </Surface>
      ))}
    </div>
  ),
};

/**
 * `palette` swaps the bg/border/text token set: `chrome`/`editorial` are the
 * app-UI and long-form-content surfaces; `accent`/`secondary`/`input` are
 * palette-toned (e.g. an annotation or nav-active state).
 */
export const Palette: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(['chrome', 'editorial', 'accent', 'secondary', 'input'] as const).map((palette) => (
        <Surface key={palette} palette={palette} className="w-32 h-20 p-4 rounded-lg">
          <Text variant="caption">{palette}</Text>
        </Surface>
      ))}
    </div>
  ),
};

/** `border={false}` drops the border, leaving just the palette's bg/text and any elevation shadow. */
export const NoBorder: Story = {
  render: () => (
    <Surface border={false} elevation="raised" className="w-40 h-24 p-4 rounded-lg">
      <Text variant="caption">border=false</Text>
    </Surface>
  ),
};

/** Surface applies no corner radius of its own — square corners by default. Pass a `rounded-*` class via `className` for a rounded box (as the other stories here do). */
export const NoRadius: Story = {
  render: () => (
    <Surface className="w-40 h-24 p-4">
      <Text variant="caption">no rounded-* class</Text>
    </Surface>
  ),
};
