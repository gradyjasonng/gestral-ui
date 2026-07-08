import type { Meta, StoryObj } from '@storybook/react-vite';
import { LabelledIconButton } from './LabelledIconButton';
import { Text } from '@primitives/Text/Text';

const meta = {
  title: 'Primitives/LabelledIconButton',
  component: LabelledIconButton,
  tags: ['autodocs'],
} satisfies Meta<typeof LabelledIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `direction="vertical"` (the default) — icon above label. This is what
 * SiteRail uses for its collapsed-state nav items, where a narrow rail
 * column needs the label centered under a compact icon fill rather than
 * competing for horizontal space.
 */
export const Vertical: Story = {
  render: () => (
    <div className="flex items-start gap-2">
      <LabelledIconButton direction="vertical" icon="star" active>Active</LabelledIconButton>
      <LabelledIconButton direction="vertical" icon="star" active="secondary">Secondary</LabelledIconButton>
      <LabelledIconButton direction="vertical" icon="star">Inactive</LabelledIconButton>
    </div>
  ),
};

/**
 * `direction="horizontal"` — icon beside label. Note this differs from
 * `Button`'s `horizontal` variant: here only the icon gets the filled
 * background (via `IconFill`), while the label sits outside it in plain
 * text. Use this when you want an icon+label pairing without the full-width
 * filled pill that `Button` produces.
 */
export const Horizontal: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-2">
      <LabelledIconButton direction="horizontal" icon="star" active>Active</LabelledIconButton>
      <LabelledIconButton direction="horizontal" icon="star" active="secondary">Secondary</LabelledIconButton>
      <LabelledIconButton direction="horizontal" icon="star">Inactive</LabelledIconButton>
    </div>
  ),
};

/**
 * `textVariant` overrides the label's typography independent of `size` —
 * by default the label variant is derived from `size` via an internal map,
 * but pass `textVariant` explicitly when a caller needs a specific type
 * scale regardless of the button's size (e.g. matching surrounding UI text).
 */
export const TextVariantOverride: Story = {
  name: 'Text Variant Override',
  render: () => (
    <div className="flex items-start gap-4">
      <LabelledIconButton icon="star" active>Default</LabelledIconButton>
      <LabelledIconButton icon="star" active textVariant="caption">Caption</LabelledIconButton>
      <LabelledIconButton icon="star" active textVariant="bodySmall">Body Small</LabelledIconButton>
    </div>
  ),
};

/**
 * `size` and `iconSize` set independently across all combinations of
 * `sm`/`md`/`lg`. `iconSize` defaults to `size` but can diverge — useful
 * when a caller wants, e.g., a larger tap target (`size="lg"`) with a
 * smaller visual icon (`iconSize="sm"`), or vice versa.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s} className="flex items-start gap-4">
          <Text variant="caption" as="span" className="font-mono text-chrome-text-muted w-6 mt-2">{s}</Text>
          {(['sm', 'md', 'lg'] as const).map((is) => (
            <div key={is} className="flex flex-col items-center gap-0.5">
              <Text variant="caption" as="span" className="font-mono text-chrome-text-muted">icon:{is}</Text>
              <LabelledIconButton size={s} iconSize={is} icon="star" active>Label</LabelledIconButton>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
