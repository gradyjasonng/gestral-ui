import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

export interface UseEdgeCollisionOptions {
  /** CSS length to keep clear of the container edge, e.g. `'2px'`. Defaults to `'2px'`. */
  margin?: string;
  /** The element whose bounds are the edge to stay clear of. Defaults to the viewport. */
  container?: RefObject<Element | null> | Element | null;
  /**
   * Whether detection starts active. Defaults to `false` — most callers only
   * need correction while some transient state (e.g. an expanded popover) is
   * active, and should flip it on via the returned `setEnabled` instead.
   */
  enabled?: boolean;
  /**
   * Minimum interval (ms) between corrections triggered by the
   * `IntersectionObserver`. Defaults to `100`. A crossing can otherwise
   * re-fire many times in quick succession — e.g. throughout a CSS size
   * transition — and applying a correction on every single one can fight
   * with anything else reacting to the element's position (like a `:hover`
   * that's lost the instant the element moves out from under the pointer),
   * producing a jittery back-and-forth instead of settling.
   */
  throttleMs?: number;
}

export interface UseEdgeCollisionResult {
  /** Re-measures immediately and re-applies (or clears) the correction. */
  recheck: () => void;
  /** Turns detection on or off. Turning it off resets any applied shift. */
  setEnabled: (enabled: boolean) => void;
}

// Threshold list fine-grained enough that intersection ratio changes during a
// CSS transition (e.g. Comment's bubble growing open) still trigger a
// re-measure repeatedly, rather than only once at full enter/exit.
const THRESHOLDS = Array.from({ length: 41 }, (_, i) => i / 40);

function cssLengthToPx(value: string, contextEl: Element): number {
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;height:0;';
  probe.style.width = value;
  (contextEl.parentElement ?? document.body).appendChild(probe);
  const px = probe.getBoundingClientRect().width;
  probe.remove();
  return px;
}

/**
 * Detects when the element at `targetRef` crosses — or already sits past —
 * the edge of `container` (defaulting to the viewport), shrunk inward by
 * `margin`, and nudges it back by setting `--edge-collision-shift-x`/`-y`
 * custom properties on that element. Consumers read those in their own CSS,
 * e.g. `transform: translate(var(--edge-collision-shift-x, 0px), var(--edge-collision-shift-y, 0px))`.
 *
 * Detection only runs while `enabled` (toggle it with the returned
 * `setEnabled`): an `IntersectionObserver` schedules a re-measure on every
 * crossing, fine-grained enough to keep tracking a CSS-transitioned size
 * change (like `Comment`'s bubble growing open) rather than firing only once
 * at full enter/exit — but those re-measures are throttled (`throttleMs`) so
 * a burst of crossings settles into one correction instead of reacting to
 * every intermediate one. Disabling resets the shift to `0px` immediately,
 * so an element that's collapsed or no longer relevant returns to its
 * natural position instead of staying nudged from whatever it last measured.
 */
export function useEdgeCollision(
  targetRef: RefObject<HTMLElement | null>,
  {
    margin = '2px',
    container,
    enabled: initialEnabled = false,
    throttleMs = 100,
  }: UseEdgeCollisionOptions = {},
): UseEdgeCollisionResult {
  const [enabled, setEnabledState] = useState(initialEnabled);
  const shift = useRef({ x: 0, y: 0 });

  const resolveRoot = useCallback((): Element | null => {
    if (!container) return null;
    return 'current' in container ? container.current : container;
  }, [container]);

  const reset = useCallback(() => {
    const el = targetRef.current;
    shift.current = { x: 0, y: 0 };
    el?.style.setProperty('--edge-collision-shift-x', '0px');
    el?.style.setProperty('--edge-collision-shift-y', '0px');
  }, [targetRef]);

  const measure = useCallback(() => {
    const el = targetRef.current;
    if (!el) return;

    const root = resolveRoot();
    const marginPx = cssLengthToPx(margin, el);
    const rawBounds = root
      ? root.getBoundingClientRect()
      : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
    const bounds = {
      left: rawBounds.left + marginPx,
      top: rawBounds.top + marginPx,
      right: rawBounds.right - marginPx,
      bottom: rawBounds.bottom - marginPx,
    };

    const rect = el.getBoundingClientRect();
    // `rect` reflects the element as currently shifted, so undo the
    // last-applied shift to get its natural (unshifted) position —
    // otherwise a shift that already fixed things reads as "no longer
    // needed" and immediately gets reset, oscillating in place.
    const natural = {
      left: rect.left - shift.current.x,
      right: rect.right - shift.current.x,
      top: rect.top - shift.current.y,
      bottom: rect.bottom - shift.current.y,
    };

    let dx = 0;
    if (natural.right > bounds.right) dx = bounds.right - natural.right;
    else if (natural.left < bounds.left) dx = bounds.left - natural.left;

    let dy = 0;
    if (natural.bottom > bounds.bottom) dy = bounds.bottom - natural.bottom;
    else if (natural.top < bounds.top) dy = bounds.top - natural.top;

    shift.current = { x: dx, y: dy };
    el.style.setProperty('--edge-collision-shift-x', `${dx}px`);
    el.style.setProperty('--edge-collision-shift-y', `${dy}px`);
  }, [margin, resolveRoot, targetRef]);

  useEffect(() => {
    if (!targetRef.current || !enabled) {
      reset();
      return;
    }

    measure();

    // Trailing-edge throttle: a burst of crossings collapses into one
    // re-measure `throttleMs` after the last of them, rather than reacting
    // to every single one.
    let pending: ReturnType<typeof setTimeout> | undefined;
    const scheduleMeasure = () => {
      clearTimeout(pending);
      pending = setTimeout(measure, throttleMs);
    };

    const observer = new IntersectionObserver(scheduleMeasure, {
      root: resolveRoot(),
      rootMargin: `-${margin} -${margin} -${margin} -${margin}`,
      threshold: THRESHOLDS,
    });
    observer.observe(targetRef.current);

    return () => {
      clearTimeout(pending);
      observer.disconnect();
    };
  }, [enabled, margin, throttleMs, resolveRoot, measure, reset, targetRef]);

  const setEnabled = useCallback((next: boolean) => setEnabledState(next), []);

  return { recheck: measure, setEnabled };
}
