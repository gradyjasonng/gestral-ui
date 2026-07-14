import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { ButtonWithPreviewCard } from './ButtonWithPreviewCard';
import { PreviewCard } from '@components/PreviewCard/PreviewCard';

const meta = {
  title: 'Components/ButtonWithPreviewCard',
  component: ButtonWithPreviewCard,
  tags: ['autodocs'],
  args: {
    label: 'Inspect Element',
    href: '#',
    icon: 'star',
    previewCard: (
      <PreviewCard
        title="Inspect Element"
        description="A web game with puzzles only solvable using developer tools."
        palette="secondary"
        href="#"
        className="h-full"
      />
    ),
  },
  decorators: [
    (Story) => (
      <div className="flex justify-center bg-canvas-surface p-24">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ButtonWithPreviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `expanded` (default false) — compact icon-only trigger, the form used in a
 * collapsed `SiteRail`.
 */
export const Compact: Story = {};

/**
 * `expanded` — horizontal icon+label trigger, the form used in an expanded
 * `SiteRail`.
 */
export const Expanded: Story = {
  args: { expanded: true },
};

/**
 * Focusing the trigger reveals `previewCard` next to it — the
 * keyboard-accessible equivalent of a mouse hover, since `:hover` itself
 * can't be driven from a test. The preview stays mounted at all times (just
 * toggled with opacity/visibility) so its content — e.g. an `<img>` — never
 * remounts and reloads on each reveal.
 */
export const FocusReveal: Story = {
  args: { expanded: true },
  play: async ({ canvasElement }) => {
    // The wrapper's onFocus/onBlur rely on real focus bubbling from the
    // trigger link — calling the link's own .focus()/.blur() (rather than
    // dispatching a synthetic, non-bubbling 'focus'/'blur' event on the
    // wrapper directly) is what actually exercises that path.
    const link = canvasElement.querySelector<HTMLElement>('[data-button-with-preview-card] a')!;

    link.focus();
    await waitFor(() => {
      const popover = document.querySelector<HTMLElement>('[data-button-with-preview-card-popover]');
      expect(popover).toBeVisible();
    });

    link.blur();
    await waitFor(() => {
      const popover = document.querySelector<HTMLElement>('[data-button-with-preview-card-popover]');
      expect(popover).not.toBeVisible();
    });
  },
};

/**
 * Placed flush against the bottom-right of the viewport, the preview would
 * otherwise spill past both edges. `useEdgeCollision` nudges it back
 * on-screen while it's focused, and resets once it's blurred again.
 */
export const NearViewportEdge: Story = {
  args: { expanded: true },
  decorators: [
    (Story) => (
      <div className="fixed bottom-1 right-1 bg-canvas-surface p-1">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector<HTMLElement>('[data-button-with-preview-card] a')!;

    link.focus();

    await waitFor(() => {
      const popover = document.querySelector<HTMLElement>('[data-button-with-preview-card-popover]')!;
      const rect = popover.getBoundingClientRect();
      expect(rect.right).toBeLessThanOrEqual(window.innerWidth - 1);
      expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight - 1);
    });

    link.blur();

    await waitFor(() => {
      const popover = document.querySelector<HTMLElement>('[data-button-with-preview-card-popover]')!;
      expect(popover.style.getPropertyValue('--edge-collision-shift-x')).toBe('0px');
      expect(popover.style.getPropertyValue('--edge-collision-shift-y')).toBe('0px');
    });
  },
};
