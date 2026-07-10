import type { ReactNode } from 'react';
import { cn } from '@lib/cn';
import { slugify } from '@lib/slugify';
import { Text } from '@primitives';
import './Artboard.css';

/**
 * Hints at the kind of content the Artboard holds, via its hover/focus colour:
 * - `default` (emerald) — static content: prose, images, layout sections.
 * - `interactive` (blue) — embedded mini-apps or other live/interactive content.
 * - `external` (purple) — embedded third-party content, e.g. a Figma iframe.
 */
export type ArtboardVariant = 'default' | 'interactive' | 'external';

export interface ArtboardProps {
  /**
   * Frame label shown above the content, evoking a Figma layer/artboard name.
   * Also becomes this Artboard's `id` (slugified), so omit it for content
   * that shouldn't be an anchorable/TOC-able section of its own (e.g. a
   * plain prose continuation between labelled Artboards).
   */
  label?: string;
  /** Colour hint for the kind of content held. Defaults to `default`. */
  variant?: ArtboardVariant;
  /**
   * Shows the label and hover/focus outline. Defaults to `true`.
   *
   * This is a per-instance override, separate from the site-wide toggle: every
   * Artboard also hides its frame when an ancestor carries
   * `data-artboard-frame="off"` (see SiteRail's frame toggle), or below the
   * `md` breakpoint, regardless of this prop. See `Artboard.css`.
   */
  frame?: boolean;
  /** The wrapped content — prose, an image, a mini-app, an iframe, etc. */
  children: ReactNode;
  className?: string;
}

/**
 * The main wrapper for content living on the Canvas — prose, images, mini-apps,
 * embedded iframes. Pure decoration: a neutral label and outline that pick up a
 * colour variant on hover/focus-within, evoking a selected element in a design
 * tool rather than a traditional content container.
 *
 * Hover/focus colouring is done in plain CSS (`Artboard.css`), not Tailwind's
 * `group-hover:`/`group-focus-within:` utilities: those match *any* ancestor
 * carrying a shared `.group` class, which bleeds through Artboard nesting in
 * both directions (hovering a nested Artboard would also light up every
 * ancestor Artboard, and hovering an ancestor would also light up every
 * Artboard nested inside it). The CSS instead scopes strictly to each
 * `[data-artboard-border]`'s own hover/focus state and its direct-child
 * label, with a `:not(:has(...))` guard on each of `:hover` and
 * `:focus-within` suppressing an ancestor's highlight only when a nested
 * Artboard is the true target of that *same* interaction — so a hover
 * several levels deep doesn't also light up every ancestor, but an
 * ancestor's own genuine focus and a descendant's own genuine hover (or vice
 * versa) still coexist. It's an `outline` rather than a `border` specifically
 * so the hover/focus width change (2px vs 1px) never affects layout — an
 * outline is painted outside the box model and doesn't trigger reflow the
 * way a `border-width` change would.
 *
 * `[data-artboard-border]` is the single root element — it carries the
 * `id`/`tabIndex`/hover-focus outline *and* the caller's `className` directly,
 * so a consumer's `className` always lands on the thing that's actually
 * outlined. The label sits inside it, absolutely positioned to float above
 * the box; `mt-6` on the root reserves the space for it (instead of a
 * `pt-6` that would sit *inside* the outline) so the label reads as sitting
 * above the frame rather than inside it. That `mt-6` stays put even when the
 * frame is hidden (site-wide toggle or narrow viewport, see `Artboard.css`)
 * — only the label's `display` and the outline's colour change, so toggling
 * frames never reflows the page.
 */
export function Artboard({ label, variant = 'default', frame = true, children, className }: ArtboardProps) {
  return (
    <div
      tabIndex={0}
      data-artboard-border=""
      data-artboard-variant={frame ? variant : undefined}
      className={cn(
        'relative outline-none bg-transparent overflow-visible w-full px-sp-sm py-sp-sm',
        frame && label && 'mt-6',
        className,
      )}
    >
      {frame && label && (
        <span data-artboard-label="" id={label ? slugify(label) : undefined} className="absolute -top-6 left-0 select-none">
          <Text variant="caption" as="span" className="text-canvas-text-muted">
            {label}
          </Text>
        </span>
      )}
      {children}
    </div>
  );
}
