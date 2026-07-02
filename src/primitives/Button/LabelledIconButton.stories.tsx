import type { Meta, StoryObj } from '@storybook/react-vite';
import { LabelledIconButton } from './LabelledIconButton';
import { Text } from '../Text/Text';

const meta = {
  title: 'Primitives/LabelledIconButton',
  component: LabelledIconButton,
  tags: ['autodocs'],
} satisfies Meta<typeof LabelledIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => (
    <div className="flex items-start gap-2">
      <LabelledIconButton direction="vertical" icon="star" active>Active</LabelledIconButton>
      <LabelledIconButton direction="vertical" icon="star" active="secondary">Secondary</LabelledIconButton>
      <LabelledIconButton direction="vertical" icon="star">Inactive</LabelledIconButton>
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-2">
      <LabelledIconButton direction="horizontal" icon="star" active>Active</LabelledIconButton>
      <LabelledIconButton direction="horizontal" icon="star" active="secondary">Secondary</LabelledIconButton>
      <LabelledIconButton direction="horizontal" icon="star">Inactive</LabelledIconButton>
    </div>
  ),
};

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
