import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '@lib/cn';
import { Icon, Text, Stack } from '@primitives';
import { useEdgeCollision } from '@lib/useEdgeCollision';
import './Comment.css';

export interface CommentProps {
  /** An optional string for the author */
  by?: string;
  /** The annotation's content, revealed inside the bubble. */
  children: ReactNode;
  className?: string;
}

/**
 * An inline comment icon whose emerald bubble itself grows to reveal its
 * text, on hover (desktop) or tap (touch/keyboard) — a checkbox toggle plus
 * a `(hover: hover)` media query drive the visual expand/collapse itself, no
 * JS involved there. `<details>`/`<summary>` would be the more obvious
 * native choice, but `<details>` isn't phrasing content and gets split out
 * of the surrounding `<p>` by the browser's parser when used inline in
 * prose — the checkbox hack stays inline-safe.
 *
 * The bubble (`label`) is a single grid container — one continuous shape,
 * not an icon bubble glued to a separate text pill — with an `auto`-sized
 * icon column and a `0fr`/`1fr` text column that grows the whole box open.
 * It's absolutely positioned over a same-sized spacer (the outer
 * `data-comment` span, pinned to the icon's collapsed footprint), so growing
 * it overlaps the surrounding prose instead of reflowing it — the same
 * tradeoff a tooltip makes. Since that growth is unconstrained by the
 * spacer's own bounds, `useEdgeCollision` watches the bubble and nudges it
 * back onto the viewport instead of spilling past a screen edge — but only
 * while the bubble is actually open (hovered, focused, or tapped); mirroring
 * the CSS's own hover/focus-within/checked triggers in JS state is what lets
 * detection turn off (and the bubble snap back to its natural position)
 * the moment it collapses, rather than staying nudged from whenever it was
 * last measured.
 *
 * The label's own transition is scoped to `max-width`/`max-height`/`padding`
 * rather than `transition-all` — it must exclude `transform`, since
 * `useEdgeCollision` assumes the shift it just set is applied instantly, not
 * mid-animation. Letting the correction itself animate made it compare a
 * settled measurement against a still-interpolating position, which fed back
 * into another (wrong) correction and never converged.
 */
export function Comment({ by, children, className }: CommentProps) {
  const id = useId();
  const labelRef = useRef<HTMLLabelElement>(null);
  const hoverLeaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [checked, setChecked] = useState(false);
  const expanded = hovered || focused || checked;

  const { setEnabled } = useEdgeCollision(labelRef, { margin: '2px' });

  useEffect(() => {
    setEnabled(expanded);
  }, [expanded, setEnabled]);

  // The edge-collision shift itself can nudge the bubble out from under a
  // stationary pointer, which would otherwise fire `mouseleave` immediately
  // and collapse it — which undoes the shift, moving the bubble back under
  // the pointer, re-triggering `mouseenter`, and so on. A short grace period
  // (cancelled by a subsequent `mouseenter`) lets a self-inflicted exit like
  // that settle instead of oscillating.
  const handleMouseEnter = () => {
    clearTimeout(hoverLeaveTimer.current);
    setHovered(true);
  };
  const handleMouseLeave = () => {
    hoverLeaveTimer.current = setTimeout(() => setHovered(false), 150);
  };

  return (
    <span
      data-comment
      className={cn('relative inline-block h-8 w-8 -translate-y-1 overflow-visible align-middle drop-shadow-md', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <input
        type="checkbox"
        id={id}
        className="peer sr-only"
        aria-label="Show comment"
        onChange={(e) => setChecked(e.target.checked)}
      />
      <label
        ref={labelRef}
        htmlFor={id}
        className="absolute bottom-0 left-0 flex flex-row items-start
          overflow-hidden rounded-2xl rounded-bl-none
          max-w-8 max-h-8 transition-[max-width,max-height,padding] duration-200
          bg-chrome-surface text-chrome-text-primary cursor-pointer
          [transform:translate(var(--edge-collision-shift-x,0px),var(--edge-collision-shift-y,0px))]"
      >
        <span className="flex m-1 h-6 w-6 rounded-full shrink-0 items-center bg-accent-default text-accent-active justify-center">
          <Icon name="comment" size="sm" />
        </span>
        <Stack as="span" direction="col" gap="xs" padding="xs">
          {
            by && <Text as="span" variant="labelXSmall" className="text-chrome-text-secondary">{by}</Text>
          }
          <Text
            as="span"
            variant="bodySmall"
            className="w-xs shrink-0 opacity-0 transition-opacity duration-100 wrap-auto"
            data-comment-note=""
          >
            {children}
          </Text>
        </Stack>
      </label>
    </span>
  );
}
