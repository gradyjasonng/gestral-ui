import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { type IconName } from '@primitives';
import { Button, type ButtonSize, type ButtonPalette } from '@components/Button/Button';
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
  /** Forwarded to the trigger `Button`'s `active` prop. */
  active?: boolean | 'secondary';
  /** Forwarded to the trigger `Button`'s `palette` prop — the color scheme applied when `active`. */
  palette?: ButtonPalette;
  /** Forwarded to the trigger `Button`'s `size`/`iconSize`. Defaults to `xl` when `expanded`, `lg` otherwise — matching the compact SiteRail trigger sizes. */
  size?: ButtonSize;
  /** Forwarded to the trigger `Button`'s `className`. */
  className?: string;
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
export function ButtonWithPreviewCard({ label, href, icon, customIcon, previewCard, expanded = false, active = false, palette, size, className }: ButtonWithPreviewCardProps) {
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
    <Button variant="horizontal" size={size ?? 'xl'} iconSize="md" icon={icon} customIcon={customIcon} href={href} active={active} palette={palette} className={className} aria-label={label}>
      {label}
    </Button>
  ) : (
    <Button variant="iconOnly" size={size ?? 'lg'} iconSize="md" icon={icon} customIcon={customIcon} href={href} active={active} palette={palette} className={className} aria-label={label} title={label} />
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
              // Fixed width, intrinsic (content-driven) height — so
              // useEdgeCollision always measures the box's *actual* rendered
              // footprint via getBoundingClientRect, whatever `previewCard`'s
              // natural height turns out to be, rather than a declared
              // fixed-height box that could clip taller content (an
              // AssetCard's fixed-aspect thumbnail plus title/meta text
              // underneath, for instance). An opaque background/rounding
              // lives here rather than on `previewCard` itself, since content
              // like AssetCard has no background of its own behind its text
              // (by design, for its in-flow rail usage) — floating this box
              // over arbitrary page content needs one regardless of what's
              // inside it.
              'fixed z-50 w-72 rounded-lg bg-chrome-surface p-2 drop-shadow-2xl transition-opacity',
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
