import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';
import { Text } from '../../primitives/Text/Text';

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

/**
 * Baseline Link with the default `underline` variant and `body` text.
 * Underline styling is the safer default for inline links inside prose,
 * where an underline is the clearest affordance that text is clickable.
 */
export const Default: Story = {};

/**
 * All three ways to control a Link's appearance side by side:
 * - `underline` — default decoration, best for links inline in body copy.
 * - `subtle` — no underline decoration, best for links in UI chrome
 *   (nav items, metadata rows) where an underline would be visual noise.
 *   Note `textVariant="h3"` here shows that `variant` only controls
 *   decoration/color, independent of typographic size.
 * - passing a `<Text>` as children instead of using `textVariant` — use
 *   this when the link needs typography that also appears elsewhere
 *   without a link wrapper (e.g. a heading that's sometimes a link).
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-6">
        <span className="w-24 shrink-0 font-mono text-xs text-chrome-text-muted">underline</span>
        <Link variant="underline" textVariant="body" href="#">Underline Link</Link>
      </div>
      <div className="flex items-center gap-6">
        <span className="w-24 shrink-0 font-mono text-xs text-chrome-text-muted">subtle</span>
        <Link variant="subtle" textVariant="h3" href="#">Subtle Link</Link>
      </div>
      <div className="flex items-center gap-6">
        <span className="w-24 shrink-0 font-mono text-xs text-chrome-text-muted">children</span>
        <Link variant="underline" href="#">
          <Text variant="body" as="span">Text as children</Text>
        </Link>
      </div>
    </div>
  ),
};
