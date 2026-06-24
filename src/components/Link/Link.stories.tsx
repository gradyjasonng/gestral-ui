import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';
import { Text } from '../Text/Text';

const meta = {
  title: 'Components/Link',
  component: Link,
  args: {
    children: 'Link text',
    href: '#',
    textVariant: 'body',
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-6">
        <span className="w-24 shrink-0 font-mono text-xs text-foreground-muted">underline</span>
        <Link variant="underline" textVariant="body" href="#">Underline Link</Link>
      </div>
      <div className="flex items-center gap-6">
        <span className="w-24 shrink-0 font-mono text-xs text-foreground-muted">subtle</span>
        <Link variant="subtle" textVariant="h3" href="#">Subtle Link</Link>
      </div>
      <div className="flex items-center gap-6">
        <span className="w-24 shrink-0 font-mono text-xs text-foreground-muted">children</span>
        <Link variant="underline" href="#">
          <Text variant="body" as="span">Text as children</Text>
        </Link>
      </div>
    </div>
  ),
};
