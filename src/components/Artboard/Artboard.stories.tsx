import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Artboard } from './Artboard';

const meta = {
  title: 'Components/Artboard',
  component: Artboard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-canvas-surface p-12 max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Artboard>;

export default meta;
type Story = StoryObj<typeof meta>;

const placeholder = (
  <div className="w-full h-64 flex items-center justify-center bg-chrome-surface">
    <span className="font-ui text-sm text-canvas-text-muted">Figma embed</span>
  </div>
);

/**
 * `default` variant (emerald accent on hover/focus) — use for static content:
 * prose blocks, images, layout sections. This is the fallback variant, and
 * the one to reach for whenever the wrapped content isn't interactive or a
 * third-party embed.
 */
export const Default: Story = {
  args: {
    label: 'case-study-alpha',
    variant: 'default',
    children: placeholder,
  },
};

/**
 * `interactive` variant (blue accent) — use when the Artboard wraps an
 * embedded mini-app, prototype, or other live/interactive content, so it
 * reads visually distinct from static prose.
 */
export const Interactive: Story = {
  args: {
    label: 'prototype-v2',
    variant: 'interactive',
    children: placeholder,
  },
};

/**
 * `external` variant (purple accent) — use when the Artboard wraps embedded
 * third-party content, e.g. a Figma iframe or other externally-hosted embed,
 * so viewers can tell at a glance that the content isn't authored inline.
 */
export const External: Story = {
  args: {
    label: 'case-study-hero',
    variant: 'external',
    children: placeholder,
  },
};

/**
 * The Artboard's root is keyboard-focusable (`tabIndex={0}`) and applies the
 * same hover accent on `focus-within`, so keyboard users get the same
 * affordance as mouse users hovering the frame. This story drives focus
 * programmatically and asserts it lands correctly — a regression check to
 * keep when touching the hover/focus styling.
 */
export const Focused: Story = {
  args: {
    label: 'case-study-alpha',
    variant: 'default',
    children: placeholder,
  },
  play: async ({ canvas }) => {
    const region = canvas.getByText('case-study-alpha').parentElement;
    expect(region).not.toBeNull();
    region?.focus();
    await expect(region).toHaveFocus();
  },
};
