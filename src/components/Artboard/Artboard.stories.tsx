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
 * `frame={false}` — a per-instance opt-out of the label and hover/focus
 * border, e.g. for a full-bleed embed where the frame chrome would be
 * distracting. This is separate from the site-wide toggle in SiteRail
 * and the mobile breakpoint, which hide every Artboard's frame via CSS
 * regardless of this prop.
 */
export const NoFrame: Story = {
  args: {
    label: 'case-study-alpha',
    variant: 'default',
    frame: false,
    children: placeholder,
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText('case-study-alpha')).not.toBeInTheDocument();
  },
};

/**
 * The site-wide toggle (SiteRail's frame button) hides the label as well as
 * the border, by setting `data-artboard-frame="off"` on `<html>` — see
 * `Artboard.css`. Regression check for the label's `data-artboard-label` hook
 * actually landing on a real DOM node (`Text` doesn't forward unknown props,
 * so it has to sit on a wrapping `<span>` instead).
 *
 * Also a regression check that toggling frames off doesn't reflow the page:
 * the root's `mt-6` (reserving space for the label) must stay put — only the
 * label's `display` and the outline's colour change.
 */
export const FrameHiddenGlobally: Story = {
  args: {
    label: 'case-study-alpha',
    variant: 'default',
    children: placeholder,
  },
  beforeEach: () => {
    document.documentElement.setAttribute('data-artboard-frame', 'off');
    return () => document.documentElement.removeAttribute('data-artboard-frame');
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('case-study-alpha')).not.toBeVisible();

    const region = canvasElement.querySelector<HTMLElement>('[data-artboard-border]')!;
    await expect(getComputedStyle(region).marginTop).not.toBe('0px');
  },
};

/**
 * A nested Artboard's `:focus-within` bleeds up onto every ancestor (real
 * focus lives inside their box too), so an ancestor should suppress its own
 * focus highlight whenever a *nested* Artboard is the true target — never
 * showing both at once for the same interaction. See `Artboard.css`'s
 * `:focus-within:not(:has([data-artboard-border]:focus-within))` guard (and
 * its `:hover` counterpart, which isn't exercised here — see below).
 *
 * `:hover` itself can't be driven from a test (dispatched pointer events
 * don't set real browser `:hover` state), so this exercises the same
 * same-type-nesting-suppression logic via `:focus-within`, which responds
 * identically and *is* driven by a real, testable DOM API
 * (`element.focus()`).
 */
export const Nested: Story = {
  render: () => (
    <Artboard label="Outer" variant="default">
      <div className="p-6">
        <Artboard label="Inner" variant="interactive">
          {placeholder}
        </Artboard>
      </div>
    </Artboard>
  ),
  play: async ({ canvasElement }) => {
    const outerRoot = canvasElement.querySelector<HTMLElement>('#outer')!;
    const innerRoot = canvasElement.querySelector<HTMLElement>('#inner')!;

    // Focusing the nested (inner) Artboard highlights only the inner one.
    innerRoot.focus();
    await expect(innerRoot).toHaveFocus();
    await expect(getComputedStyle(innerRoot).outlineColor).not.toBe('rgba(0, 0, 0, 0)');
    await expect(getComputedStyle(outerRoot).outlineColor).toBe('rgba(0, 0, 0, 0)');
    innerRoot.blur();

    // Focusing the outer Artboard directly highlights only the outer one —
    // it must not bleed down onto the Artboard nested inside it.
    outerRoot.focus();
    await expect(outerRoot).toHaveFocus();
    await expect(getComputedStyle(outerRoot).outlineColor).not.toBe('rgba(0, 0, 0, 0)');
    await expect(getComputedStyle(innerRoot).outlineColor).toBe('rgba(0, 0, 0, 0)');
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
    const region = canvas.getByText('case-study-alpha').closest<HTMLElement>('[data-artboard-border]');
    expect(region).not.toBeNull();
    region?.focus();
    await expect(region).toHaveFocus();
  },
};
