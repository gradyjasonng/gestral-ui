import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@lib/cn';

export interface CanvasProps {
  children?: ReactNode;
  className?: string;
}

const MIN_SCALE = 1;
const MAX_SCALE = 4;
// Trackpad pinch gestures report small deltaY values per event; this keeps zoom feeling gradual.
const ZOOM_SENSITIVITY = 0.01;

const SCROLL_STORAGE_KEY_PREFIX = 'gestral-ui:canvas-scroll:';

/** Stubbed artboard area — the content region a Shell lays out alongside its rails */
export function Canvas({ children, className }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // Trackpad pinch-zoom is reported as a wheel event with ctrlKey set (Chrome/Firefox/Safari
    // convention). preventDefault stops the browser from zooming the whole page instead.
    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      setScale((prev) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev - event.deltaY * ZOOM_SENSITIVITY)));
    };

    node.addEventListener('wheel', handleWheel, { passive: false });
    return () => node.removeEventListener('wheel', handleWheel);
  }, []);

  // Canvas is a plain scrollable <div>, not the document — browsers only ever
  // auto-restore scroll position for the document's own scroll, so a full
  // refresh would otherwise always land back at the top. Persisted per-path in
  // sessionStorage (cleared when the tab closes, like native scroll
  // restoration) rather than localStorage, which would resurrect a stale
  // position indefinitely. useLayoutEffect restores before paint to avoid a
  // visible jump; the `load` listener re-applies it once images/fonts below
  // the fold have finished affecting scrollHeight.
  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node || typeof window === 'undefined') return;

    const key = SCROLL_STORAGE_KEY_PREFIX + window.location.pathname + window.location.search;

    const restore = () => {
      const saved = window.sessionStorage.getItem(key);
      if (saved !== null) node.scrollTop = Number(saved);
    };
    restore();
    window.addEventListener('load', restore);

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        window.sessionStorage.setItem(key, String(node.scrollTop));
      });
    };
    node.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('load', restore);
      node.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      // Hook for consumers (e.g. a CanvasRail scrollspy) to locate this scroll
      // container from outside without threading a ref through Shell/SiteShell.
      data-canvas-viewport=""
      className={cn('min-w-0 h-full overflow-y-auto bg-canvas-surface', className)}
      // Horizontal scroll is only ever legitimate as a consequence of the user
      // zooming in (the whole content wrapper below is scaled up, so it outgrows
      // the viewport on purpose and needs to be pannable). At the default scale,
      // content should never be wider than the viewport — Astro pages are built
      // with max-w-full throughout — so overflow-x is explicitly hidden there
      // rather than left to the CSS spec's implicit 'auto' (which is what you get
      // for free the moment overflow-y is non-'visible'). That implicit auto is
      // exactly what let a rotated-element layout bug in one post (its post-transform
      // bounding box exceeding its own container — see squaring-a-circle-line's
      // CircleLines diagram) turn into a real horizontal scrollbar on the whole page
      // at narrow viewports instead of being clipped. Content bugs like that should
      // still be fixed at the source (clip the transformed element to its own box),
      // but this is the backstop that keeps them from ever reaching the user as a
      // page-level scrollbar.
      style={{ overflowX: scale > MIN_SCALE ? 'auto' : 'hidden' }}
    >
      <div className="origin-top-left" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
