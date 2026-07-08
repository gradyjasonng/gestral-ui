import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, waitFor } from 'storybook/test';
import { Comment } from './Comment';

const meta = {
  title: 'Components/Comment',
  component: Comment,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-canvas-surface p-48 max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Comment>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Dropped inline in prose, the way it's used in blog posts — a comment icon
 * trailing the sentence it annotates. Hover it on desktop, or tap/click it
 * on touch, to reveal the note. Rendered as a `<span>`/checkbox/`<label>`
 * rather than `<details>`/`<summary>`, since `<details>` isn't phrasing
 * content and gets split out of the surrounding `<p>` by the browser's
 * parser when used inline in prose.
 */
export const Default: Story = {
  args: {
    by: 'Author',
    children: 'A short aside providing extra context for the preceding sentence.',
  },
  render: (args) => (
    <p className="text-canvas-text-primary leading-relaxed">
      This is a sentence with a comment attached to it. <Comment {...args} />
    </p>
  ),
};

/**
 * Clicking (or tapping) the icon toggles the note open via a checkbox
 * driving a sibling selector — no JS required. This is the touch and
 * keyboard-accessible path; `:hover` itself can't be driven from a test (see
 * `Artboard.stories.tsx`), so this exercises the always-testable click path.
 */
export const ClickToOpen: Story = {
  args: {
    children: 'Revealed by clicking the icon, closed by clicking it again.',
  },
  render: (args) => (
    <p className="text-canvas-text-primary leading-relaxed">
      Click the icon to reveal the note. <Comment {...args} />
    </p>
  ),
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector<HTMLInputElement>('[data-comment] input')!;
    const note = canvasElement.querySelector<HTMLElement>('[data-comment-note]')!;

    await expect(note).not.toBeVisible();

    await fireEvent.click(checkbox);
    await expect(checkbox.checked).toBe(true);
    // The popover slides/fades in via a CSS transition rather than an instant
    // `display` toggle, so give it a tick to clear the opacity-0 starting frame.
    await waitFor(() => expect(note).toBeVisible());

    await fireEvent.click(checkbox);
    await expect(checkbox.checked).toBe(false);
    await waitFor(() => expect(note).not.toBeVisible());
  },
};

/**
 * Keyboard focus (`:focus-within`) reveals the note the same way desktop
 * `:hover` does, without requiring the checkbox to be checked — the
 * keyboard-accessible equivalent of a mouse hover.
 */
export const FocusReveal: Story = {
  args: {
    children: 'Revealed by focusing the icon via the keyboard.',
  },
  render: (args) => (
    <p className="text-canvas-text-primary leading-relaxed">
      Tab to the icon to reveal the note. <Comment {...args} />
    </p>
  ),
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector<HTMLInputElement>('[data-comment] input')!;
    checkbox.focus();
    await expect(checkbox).toHaveFocus();
  },
};
