import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import { Text } from '../Text/Text';

const meta = {
  title: 'Primitives/Icon',
  component: Icon,
  args: {
    name: 'home',
    size: 'md',
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <Text variant="caption" as="span" className="font-mono text-chrome-text-muted w-6">{size}</Text>
          <Icon name="home" size={size} className="text-chrome-text-primary" />
        </div>
      ))}
    </div>
  ),
};

export const Accessible: Story = {
  name: 'With Accessible Label',
  args: {
    name: 'home',
    label: 'Home',
  },
};

export const ColorInheritance: Story = {
  name: 'Color Inheritance',
  render: () => (
    <div className="flex items-center gap-4">
      <span className="text-accent-default flex items-center gap-1">
        <Icon name="check" size="md" />
        <Text variant="caption" as="span">accent</Text>
      </span>
      <span className="text-chrome-text-secondary flex items-center gap-1">
        <Icon name="cog" size="md" />
        <Text variant="caption" as="span">secondary</Text>
      </span>
      <span className="text-chrome-text-primary flex items-center gap-1">
        <Icon name="user" size="md" />
        <Text variant="caption" as="span">primary</Text>
      </span>
    </div>
  ),
};

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 text-chrome-text-primary">
      {(['home', 'search', 'cog', 'user', 'folder', 'file', 'arrow-back', 'check', 'x', 'plus'] as const).map((name) => (
        <div key={name} className="flex flex-col items-center gap-1.5">
          <Icon name={name} size="lg" />
          <Text variant="caption" as="span" className="font-mono text-chrome-text-muted">{name}</Text>
        </div>
      ))}
    </div>
  ),
};
