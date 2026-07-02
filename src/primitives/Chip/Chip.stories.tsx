import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from './Chip';
import { Text } from '../Text/Text';
import { Icon } from '../Icon/Icon';

const meta = {
  title: 'Primitives/Chip',
  component: Chip,
  tags: ['autodocs'],
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Chip active>Blog</Chip>
      <Chip active="secondary">Work</Chip>
      <Chip>Writing</Chip>
    </div>
  ),
};

export const WithIcon: Story = {
  name: 'With Icon',
  render: () => (
    <div className="flex items-center gap-2">
      <Chip icon={<Icon name="star" size="sm" />} active>Starred</Chip>
      <Chip icon={<Icon name="star" size="sm" />}>Starred</Chip>
    </div>
  ),
};

export const IconOnly: Story = {
  name: 'Icon Only',
  render: () => (
    <div className="flex items-center gap-2">
      <Chip iconOnly icon={<Icon name="star" size="sm" />} active aria-label="Star (active)">Star</Chip>
      <Chip iconOnly icon={<Icon name="star" size="sm" />} aria-label="Star">Star</Chip>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s} className="flex items-center gap-2">
          <Text variant="caption" as="span" className="font-mono text-chrome-text-muted w-6">{s}</Text>
          <Chip size={s} active>Active</Chip>
          <Chip size={s} active="secondary">Secondary</Chip>
          <Chip size={s}>Inactive</Chip>
          <Chip size={s} iconOnly icon={<Icon name="star" size="sm" />} aria-label="Star">Star</Chip>
        </div>
      ))}
    </div>
  ),
};
