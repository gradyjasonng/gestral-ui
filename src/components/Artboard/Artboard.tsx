import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@lib/cn';
import { slugify } from '@lib/slugify';
import { DEFAULT_ARTBOARD_ICON } from '@lib/defaultArtboardIcon';
import { Text, Icon, type IconName } from '@primitives';
import './Artboard.css';

/**
 * Hints at the kind of content the Artboard holds, via its hover/focus colour:
 * - `default` (emerald) — static content: prose, images, layout sections.
 * - `interactive` (blue) — embedded mini-apps or other live/interactive content.
 * - `external` (purple) — embedded third-party content, e.g. a Figma iframe.
 */
export type ArtboardTone = 'default' | 'interactive' | 'external';

export interface ArtboardOwnProps {
  /**
   * Frame label shown above the content, evoking a Figma layer/artboard name.
   * Also becomes this Artboard's `id` (slugified), so omit it for content
   * that shouldn't be an anchorable/TOC-able section of its own (e.g. a
   * plain prose continuation between labelled Artboards).
   */
  label?: string;
  /**
   * Leading icon shown before the label, echoing the Figma layers metaphor
   * `LayerList` already uses for the same Artboards mirrored into a rail
   * TOC. Defaults to `DEFAULT_ARTBOARD_ICON` (a frame) whenever `label` is
   * set; has no effect without one.
   */
  icon?: IconName;
  /** Colour hint for the kind of content held. Defaults to `default`. */
  tone?: ArtboardTone;
  /**
   * Shows the label and hover/focus outline. Defaults to `true`.
   *
   * This is a per-instance override, separate from the site-wide toggle: every
   * Artboard also hides its frame when an ancestor carries
   * `data-artboard-frame="off"` (see SiteRail's frame toggle), or below the
   * `md` breakpoint, regardless of this prop. See `Artboard.css`.
   */
  frame?: boolean;
  /**
   * Adds four solid corner selection-handle squares at the outline's
   * corners, evoking a resizable layer selection in a design tool. Defaults
   * to `false`. Handles are filled (not hollow) so the outline doesn't show
   * through them, and pick up the same `tone` colour as the outline —
   * but unlike the outline, they only appear on this exact Artboard's own
   * `:focus` (not hover, and not `focus-within` from a nested element) — see
   * `Artboard.css`.
   */
  withHandles?: boolean;
  /**
   * Opts this Artboard out of the site-wide frame toggle and the `md`-breakpoint
   * frame hide, so its outline/handles/label stay visible regardless of either.
   * Defaults to `false`. Intended for purely decorative Artboards (e.g.
   * wrapping a page heading) that aren't a togglable content frame — see
   * `Artboard.css`.
   */
  exemptFromFrameToggle?: boolean;
  /**
   * Shows the outline (and handles, if `withHandles`) in their tone colour
   * at rest, instead of only on hover/focus-within. Defaults to `false`.
   * Hover/focus still thickens the outline as usual on top of this. Intended
   * for purely decorative Artboards that should read as permanently
   * "selected" rather than only on interaction — see `Artboard.css`.
   */
  isAlwaysOutlined?: boolean;
  /**
   * Includes this Artboard as an entry in the page's table of contents
   * (built by `gradaigh-astro`'s remark plugin from the MDX source — this
   * prop does nothing at render time, it's a compile-time marker read
   * straight off the JSX attribute). Omit it (the default) to keep an
   * Artboard out of the TOC entirely — most Artboards, e.g. one wrapping a
   * single paragraph or figure, shouldn't clutter it. Pass `true` to include
   * it at its natural nesting depth, or an integer to additionally indent it
   * that many extra levels beyond that (e.g. `1` to nest it one level deeper
   * than its actual DOM position would imply) — 0 by itself is equivalent to
   * `true`.
   */
  includeInToc?: boolean | number;
  /** The wrapped content — prose, an image, a mini-app, an iframe, etc. */
  children: ReactNode;
  className?: string;
}

/**
 * `ArtboardProps<C>` — polymorphic over `as`: pass any HTML tag name (the
 * default is `'div'`) or a gestral-ui component like `Text` to merge
 * Artboard's own outline/label/handle behaviour directly onto that
 * component's root element instead of wrapping it in an extra `<div>`. Extra
 * props not part of `ArtboardOwnProps` are typed against whatever `as`
 * resolves to and forwarded straight through — e.g. `as={Text} variant="h3"`
 * both renders as an `h3`-styled `Text` *and* is the Artboard's own outlined
 * root, in one element.
 *
 * Caution: only reach for this with a target whose default rendered element
 * doesn't itself get re-wrapped by something else expecting to own that
 * slot — e.g. `as={Text}` on a single JS-expression child (a heading, a
 * caption) collapses cleanly, but merging it onto a raw MDX-authored
 * paragraph of markdown text does not: markdown always parses that content
 * as its own `paragraph` node (a literal nested `<p>`) regardless of the
 * element it's placed inside, so a `Text`-as-`<p>` target would double up
 * into invalid `<p><p>...</p></p>` markup. Wrap markdown prose in a plain
 * (non-`Text`) Artboard instead — the underline effect below only ever
 * triggers off a `Text` that's Artboard's own immediate child, so a plain
 * `<div>`/`<p>`-free wrap never picks it up anyway.
 */
export type ArtboardProps<C extends ElementType = 'div'> = ArtboardOwnProps &
  Omit<ComponentPropsWithoutRef<C>, keyof ArtboardOwnProps | 'as'> & {
    /** Root element tag, or a gestral-ui component to merge Artboard's behaviour onto — see `ArtboardProps` above. Defaults to `div`. */
    as?: C;
  };

/**
 * The main wrapper for content living on the Canvas — prose, images, mini-apps,
 * embedded iframes. Pure decoration: a neutral label and outline that pick up a
 * colour tone on hover/focus-within, evoking a selected element in a design
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
 *
 * `as` is polymorphic — see `ArtboardProps` above for how it merges onto
 * another component's root instead of wrapping it.
 */
export function Artboard<C extends ElementType = 'div'>({
  label,
  icon,
  tone = 'default',
  frame = true,
  withHandles = false,
  exemptFromFrameToggle = false,
  isAlwaysOutlined = false,
  includeInToc: _includeInToc,
  children,
  className,
  as,
  ...rest
}: ArtboardProps<C>) {
  const Tag = (as ?? 'div') as ElementType;
  return (
    <Tag
      // Internal DOM plumbing (data-artboard-*, tabIndex, id) comes after
      // `rest` deliberately: it's not part of `ArtboardOwnProps`, so a
      // consumer's own extra props (meant for a polymorphic `as` target,
      // e.g. Text's `variant`) never get a chance to clobber it. Those
      // internal attributes aren't part of the polymorphic target's own
      // typed props either (e.g. Text has no `data-artboard-border` prop) —
      // this is the one place that's a deliberate, narrow type escape,
      // rather than something a caller of Artboard itself needs to reason
      // about.
      {...(rest as ComponentPropsWithoutRef<'div'>)}
      tabIndex={0}
      data-artboard-border=""
      data-artboard-tone={frame ? tone : undefined}
      data-artboard-frame-exempt={exemptFromFrameToggle ? '' : undefined}
      data-artboard-always-outlined={frame && isAlwaysOutlined ? '' : undefined}
      id={label ? slugify(label) : undefined}
      className={cn(
        'relative outline-none bg-transparent overflow-visible w-full px-sp-sm py-sp-sm',
        frame && label && 'mt-6',
        className,
      )}
    >
      {frame && label && (
        <span data-artboard-label="" className="absolute -top-6 left-0 flex items-center gap-1 select-none">
          <Icon name={icon ?? DEFAULT_ARTBOARD_ICON} size="xs" className="text-canvas-text-muted" />
          <Text variant="caption" as="span" className="text-canvas-text-muted">
            {label}
          </Text>
        </span>
      )}
      {frame && withHandles && (
        <>
          <span data-artboard-handle="" className="absolute -top-1 -left-1 h-2 w-2" />
          <span data-artboard-handle="" className="absolute -top-1 -right-1 h-2 w-2" />
          <span data-artboard-handle="" className="absolute -bottom-1 -left-1 h-2 w-2" />
          <span data-artboard-handle="" className="absolute -bottom-1 -right-1 h-2 w-2" />
        </>
      )}
      {children}
    </Tag>
  );
}
