import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button, type IconName } from '@primitives';
import { cn } from '@lib/cn';
import { useEdgeCollision } from '@lib/useEdgeCollision';

export interface ButtonWithPreviewCardProps {
  label: string;
  href: string;
  icon?: IconName;
  /** Site-specific icon rendered on the trigger — see `Button`'s `customIcon`. */
  customIcon?: ReactNode;
  /**
    Rich preview (e.g. a `PreviewCard`) revealed on hover/focus, next to the
    compact trigger. On touch devices — which can't hover — this renders
    directly as the link instead of the compact trigger.
  */
  previewCard: ReactNode;
  /** When true, renders the trigger as a horizontal icon+label `Button`; otherwise a compact icon-only `Button`. */
  expanded?: boolean;
}

/**
 * A `Button` that reveals a rich preview (typically a `PreviewCard`) next to
 * it on hover/focus — portaled to `document.body` and positioned via
 * `getBoundingClientRect` rather than CSS-absolute inside the trigger, so it
 * isn't clipped by a scroll-clipping ancestor (e.g. `Rail`'s
 * `overflow-y-auto` — per the CSS overflow spec, pairing a non-`visible`
 * `overflow-y` with a `visible` overflow-x forces the x-axis to compute as
 * `auto` too, silently clipping anything that would otherwise poke out past
 * the ancestor's own width). `useEdgeCollision` then nudges that preview back
 * onto the viewport if it would otherwise run past an edge. On touch devices
 * (no hover), the preview itself renders as the link instead of the compact
 * trigger.
 */
export function ButtonWithPreviewCard({ label, href, icon, customIcon, previewCard, expanded = false }: ButtonWithPreviewCardProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [hovered, setHovered] = useState(false);

  // Track the trigger's position continuously (not just on hover) so the
  // portaled preview can stay mounted at all times and just be toggled with
  // opacity/visibility — mounting it fresh on every hover would remount its
  // <img> tags and cause a visible reload flash each time.
  useEffect(() => {
    const update = () => setRect(triggerRef.current?.getBoundingClientRect() ?? null);
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, []);

  // The preview is positioned from the trigger's right edge, which can push
  // it past the viewport bottom/right for triggers near the edge of the
  // screen — useEdgeCollision nudges it back on screen, only while visible.
  const { setEnabled: setEdgeCollisionEnabled } = useEdgeCollision(previewRef, { margin: '8px' });
  useEffect(() => {
    setEdgeCollisionEnabled(hovered);
  }, [hovered, setEdgeCollisionEnabled]);

  const trigger = expanded ? (
    <Button variant="horizontal" size="xl" iconSize="md" icon={icon} customIcon={customIcon} href={href} aria-label={label}>
      {label}
    </Button>
  ) : (
    <Button variant="iconOnly" size="lg" iconSize="md" icon={icon} customIcon={customIcon} href={href} aria-label={label} title={label} />
  );

  return (
    <>
      <div
        ref={triggerRef}
        data-button-with-preview-card=""
        className="hidden [@media(hover:hover)]:block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        {trigger}
        {rect && typeof document !== 'undefined' && createPortal(
          <div
            ref={previewRef}
            data-button-with-preview-card-popover=""
            className={cn(
              // `overflow-hidden` keeps this box's rendered footprint equal to
              // its declared h-62/aspect-4/3 size — otherwise arbitrary
              // `previewCard` content taller than that (e.g. a PreviewCard
              // whose meta text pushes past the thumbnail) would visually
              // spill past what useEdgeCollision measures, so its correction
              // would undershoot: it'd correctly clear the box it *thinks*
              // this is, while the actually-rendered content keeps
              // overflowing.
              'fixed z-50 h-62 aspect-4/3 overflow-hidden drop-shadow-2xl transition-opacity',
              '[transform:translate(var(--edge-collision-shift-x,0px),var(--edge-collision-shift-y,0px))]',
              hovered ? 'opacity-100' : 'opacity-0 invisible pointer-events-none',
            )}
            style={{ left: rect.right + 12, top: rect.top }}
          >
            {previewCard}
          </div>,
          document.body,
        )}
      </div>
      <div className="[@media(hover:hover)]:hidden w-full">
        {previewCard}
      </div>
    </>
  );
}
