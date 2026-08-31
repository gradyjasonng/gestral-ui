import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Artboard } from './Artboard';
import { Text } from '@primitives';

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
 * `as="li"` overrides the root tag — for an Artboard that's itself an item
 * inside a `Stack as="ul"`/`as="ol"` list. Regression check that the root
 * actually renders as a real `<li>` rather than silently staying a `<div>`.
 */
export const AsListItem: Story = {
  render: () => (
    <ul className="flex gap-4 list-none p-0 m-0">
      <Artboard as="li" label="item-one" variant="default">
        {placeholder}
      </Artboard>
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const region = canvasElement.querySelector('[data-artboard-border]')!;
    await expect(region.tagName).toBe('LI');
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
  // Excluded from the aggregated Docs page: this story's beforeEach sets
  // data-artboard-frame="off" on the shared <html>, and its cleanup only
  // runs on unmount — but Docs mode mounts every story in this file inline,
  // in one shared document, without ever unmounting them individually. Left
  // in, the attribute would stay "off" for as long as the Docs page is open,
  // killing every other story's hover/focus outline via Artboard.css's
  // `!important` rule. The story's own Canvas tab (a fresh document per
  // story) is unaffected and still exercises the real behavior.
  tags: ['!autodocs'],
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
 * *solid* focus highlight whenever a *nested* Artboard is the true target —
 * never showing both at once for the same interaction. See `Artboard.css`'s
 * `:focus-within:not(:has([data-artboard-border]:focus-within))` guard (and
 * its `:hover` counterpart, which isn't exercised here — see below).
 *
 * That's not the *only* thing the immediate parent shows, though: it also
 * picks up the dashed "breadcrumb" outline `FocusBreadcrumb` below covers in
 * more depth (with three levels, to actually distinguish "immediate parent"
 * from "any ancestor"). With only two levels here, focusing Inner still
 * dashes Outer — this story just asserts Outer's solid self-highlight stays
 * suppressed, not that it's unoutlined altogether.
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

    // Focusing the nested (inner) Artboard highlights the inner one with its
    // own solid outline; the outer one picks up the dashed breadcrumb
    // instead of its own solid self-highlight — never both solid at once.
    innerRoot.focus();
    await expect(innerRoot).toHaveFocus();
    await expect(getComputedStyle(innerRoot).outlineStyle).toBe('solid');
    await expect(getComputedStyle(innerRoot).outlineColor).not.toBe('rgba(0, 0, 0, 0)');
    await expect(getComputedStyle(outerRoot).outlineStyle).toBe('dashed');
    innerRoot.blur();

    // Focusing the outer Artboard directly highlights only the outer one —
    // it must not bleed down onto the Artboard nested inside it, which goes
    // fully unoutlined as a descendant of the genuinely-focused Artboard.
    outerRoot.focus();
    await expect(outerRoot).toHaveFocus();
    await expect(getComputedStyle(outerRoot).outlineColor).not.toBe('rgba(0, 0, 0, 0)');
    await expect(getComputedStyle(innerRoot).outlineColor).toBe('rgba(0, 0, 0, 0)');
  },
};

/**
 * Two more nesting hints layer on top of the suppression `Nested` above
 * exercises, both driven by Artboard.css's "genuinely hovered/focused"
 * concept:
 *
 * - **Hover** dashes the outline of every Artboard nested inside whichever
 *   one is genuinely hovered (any depth), in each nested Artboard's own
 *   variant colour — a lighter "this is inside what you're hovering" hint
 *   alongside the genuinely-hovered one's own solid outline. `:hover` can't
 *   be driven from a `play` function (see `Nested`'s doc comment), so this
 *   half isn't asserted here — open this story's Canvas tab and hover
 *   "Outer" to see "Middle" and "Inner" both dash.
 * - **Focus** instead draws a "breadcrumb": every Artboard nested inside the
 *   genuinely-focused one goes fully unoutlined (even if separately
 *   hovered), while its *immediate* parent dashes regardless of hover
 *   state. With three levels nested — Outer > Middle > Inner — focusing
 *   Inner dashes only Middle (its immediate parent), leaves Outer
 *   unoutlined entirely (not immediate), and Inner keeps its own normal
 *   solid focus outline.
 */
export const FocusBreadcrumb: Story = {
  render: () => (
    <Artboard label="Outer" variant="default">
      <div className="p-6">
        <Artboard label="Middle" variant="interactive">
          <div className="p-6">
            <Artboard label="Inner" variant="external">
              {placeholder}
            </Artboard>
          </div>
        </Artboard>
      </div>
    </Artboard>
  ),
  play: async ({ canvasElement }) => {
    const outerRoot = canvasElement.querySelector<HTMLElement>('#outer')!;
    const middleRoot = canvasElement.querySelector<HTMLElement>('#middle')!;
    const innerRoot = canvasElement.querySelector<HTMLElement>('#inner')!;

    innerRoot.focus();
    await expect(innerRoot).toHaveFocus();

    // Inner (genuinely focused): its own normal solid outline.
    await expect(getComputedStyle(innerRoot).outlineStyle).toBe('solid');
    await expect(getComputedStyle(innerRoot).outlineColor).not.toBe('rgba(0, 0, 0, 0)');

    // Middle (immediate parent): dashed, regardless of hover.
    await expect(getComputedStyle(middleRoot).outlineStyle).toBe('dashed');
    await expect(getComputedStyle(middleRoot).outlineColor).not.toBe('rgba(0, 0, 0, 0)');

    // Outer (grandparent, not immediate): no outline at all.
    await expect(getComputedStyle(outerRoot).outlineColor).toBe('rgba(0, 0, 0, 0)');

    innerRoot.blur();
  },
};

/**
 * A `Text` that's an Artboard's own *immediate* child (not nested inside
 * some other wrapper passed as children) underlines in the variant colour on
 * the same genuinely-hovered/focused triggers as the outline — including
 * hover, unlike the handles' focus-only behaviour — evoking a Figma text
 * frame. The underline is a fixed `2px` regardless of the `Text` variant's
 * own font weight/size (`text-decoration-thickness: auto` would otherwise
 * scale a heading's underline noticeably thicker than a caption's).
 *
 * `:hover` can't be driven from a `play` function (see `Nested`'s doc
 * comment), so only the focus half is asserted here — open this story's
 * Canvas tab and hover it to see the other half.
 */
export const TextFrame: Story = {
  render: () => (
    <Artboard label="case-study-alpha" variant="default">
      <Text variant="h3">Sample headline</Text>
    </Artboard>
  ),
  play: async ({ canvasElement }) => {
    const region = canvasElement.querySelector<HTMLElement>('[data-artboard-border]')!;
    const text = canvasElement.querySelector<HTMLElement>('[data-text]')!;

    await expect(getComputedStyle(text).textDecorationLine).toBe('none');
    region.focus();
    await expect(region).toHaveFocus();
    await expect(getComputedStyle(text).textDecorationLine).toBe('underline');
    await expect(getComputedStyle(text).textDecorationThickness).toBe('2px');
  },
};

/**
 * `withHandles` adds four solid corner selection-handle squares to the
 * outline, evoking a resizable layer selection in a design tool. They're
 * filled (`background-color`), not hollow, so the outline underneath
 * doesn't show through the handle, and pick up the same variant colour as
 * the outline.
 *
 * Unlike the outline, handles deliberately do **not** react to `:hover` or
 * to `:focus-within` from something nested inside — only this exact
 * Artboard's own `:focus` (e.g. tabbing directly to it, or `isAlwaysOutlined`
 * for a permanently-selected decorative Artboard, see `AlwaysOutlined`
 * below). This story drives that focus and checks a handle actually picks
 * up the variant colour.
 *
 * Handles also always render on top of any outline they overlap, including
 * a *different* Artboard's — each `[data-artboard-border]` isolates its own
 * stacking context (`isolation: isolate`) and handles carry `z-index: 1`
 * within it, so a handle sitting flush against another Artboard's edge (e.g.
 * a nested Artboard with no gap to its parent) never gets visually painted
 * over by that other Artboard's outline. See `Artboard.css`'s handles
 * section for the one case this can't cover: two Artboards living under
 * *independently* `z-index`-stacked ancestors elsewhere on the page (e.g.
 * one portaled) — `z-index` can never compare across separate stacking
 * contexts, portal or not. Not exercised by any Artboard usage in this
 * codebase today (nothing portals one), so untested here.
 */
export const WithHandles: Story = {
  args: {
    label: 'case-study-alpha',
    variant: 'interactive',
    withHandles: true,
    children: placeholder,
  },
  play: async ({ canvasElement }) => {
    const region = canvasElement.querySelector<HTMLElement>('[data-artboard-border]')!;
    const handle = canvasElement.querySelector<HTMLElement>('[data-artboard-handle]')!;

    await expect(getComputedStyle(handle).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    region.focus();
    await expect(region).toHaveFocus();
    await expect(getComputedStyle(handle).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  },
};

/**
 * `isAlwaysOutlined` shows the outline (and handles, with `withHandles`) in
 * their variant colour at rest, instead of only on hover/focus-within —
 * for purely decorative Artboards that should read as permanently
 * "selected". This story checks both are already coloured before any
 * interaction, unlike `Default`/`WithHandles` above.
 */
export const AlwaysOutlined: Story = {
  args: {
    variant: 'interactive',
    withHandles: true,
    isAlwaysOutlined: true,
    children: placeholder,
  },
  play: async ({ canvasElement }) => {
    const region = canvasElement.querySelector<HTMLElement>('[data-artboard-border]')!;
    const handle = canvasElement.querySelector<HTMLElement>('[data-artboard-handle]')!;

    await expect(getComputedStyle(region).outlineColor).not.toBe('rgba(0, 0, 0, 0)');
    await expect(getComputedStyle(handle).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  },
};

/**
 * `exemptFromFrameToggle` opts a purely-decorative Artboard (e.g. wrapping a
 * page heading, not a togglable content frame) out of the site-wide frame
 * toggle: its outline, handles, and label stay visible even when
 * `data-artboard-frame="off"` is set on `<html>` — unlike `FrameHiddenGlobally`
 * above, where the same toggle hides a regular Artboard's frame.
 */
export const ExemptFromFrameToggle: Story = {
  // Excluded from the aggregated Docs page for the same reason as
  // `FrameHiddenGlobally`: this story's beforeEach sets `data-artboard-frame`
  // on the shared <html>, and Docs mode never unmounts stories individually
  // to run the cleanup.
  tags: ['!autodocs'],
  args: {
    label: 'case-study-alpha',
    variant: 'default',
    withHandles: true,
    exemptFromFrameToggle: true,
    children: placeholder,
  },
  beforeEach: () => {
    document.documentElement.setAttribute('data-artboard-frame', 'off');
    return () => document.documentElement.removeAttribute('data-artboard-frame');
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('case-study-alpha')).toBeVisible();

    const region = canvasElement.querySelector<HTMLElement>('[data-artboard-border]')!;
    const handle = canvasElement.querySelector<HTMLElement>('[data-artboard-handle]')!;
    region.focus();
    await expect(region).toHaveFocus();
    await expect(getComputedStyle(region).outlineColor).not.toBe('rgba(0, 0, 0, 0)');
    await expect(getComputedStyle(handle).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
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
