import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import { cn } from '@lib/cn';
import { Tag, type TagPalette } from '@components/Tag/Tag';
import { useResolvedEndpoints, type Pt } from './useResolvedEndpoints';
import './Connector.css';

/** `useLayoutEffect` on the client, `useEffect` on the server — avoids React's SSR warning. */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type ConnectorShape = 'straight' | 'elbow' | 'curved';
export type ConnectorVariant = 'flow' | 'prototype' | 'reference' | 'neutral';
export type ConnectorCap = 'none' | 'arrow' | 'triangle' | 'dot' | 'ring';
export type ConnectorSide = 'top' | 'right' | 'bottom' | 'left';
/** `'start'` / `'center'` / `'end'` (0 / 0.5 / 1), or a `0`–`1` fraction along the edge. */
export type ConnectorAlign = 'start' | 'center' | 'end' | number;

/**
 * A px number, or any CSS length string resolved against the connector's
 * positioned ancestor — `'2rem'`, `'50%'`, `'calc(100% - 1rem)'`,
 * `'var(--spacing-sp-xl)'`. `%` is width-relative on the `x` axis,
 * height-relative on `y`. A leading `-` negates a measured string
 * (`'-1rem'`, `'-var(--x)'`); for a negative `calc()` pass a number instead.
 */
export type ConnectorLength = number | string;

/** @deprecated renamed to {@link ConnectorLength}. */
export type ConnectorCoordinate = ConnectorLength;

/** Which part of an anchored element's box to read along one axis — `'start'`
 *  (left / top), `'end'` (right / bottom), `'center'` (default), or a `0`–`1`
 *  fraction. */
export type ConnectorEdge = 'start' | 'end' | 'center' | number;

/** One axis (`x` or `y`) of a {@link ConnectorPoint} — a length, a value read
 *  off an element, or a value copied from the opposite endpoint's same axis. */
export type ConnectorAxis = ConnectorLength | ConnectorAxisAnchor | ConnectorAxisMatch;

export interface ConnectorAxisAnchor {
  /** `id` of the element to read this axis from — survives the `.astro` / MDX / React-island boundary. */
  id?: string;
  /** Element `ref` to read this axis from (alternative to `id`). */
  ref?: RefObject<Element | null>;
  /** Which part of the element's box along this axis. Default `'center'`. */
  edge?: ConnectorEdge;
  /** A length added after resolving — px number or CSS string. */
  offset?: ConnectorLength;
}

export interface ConnectorAxisMatch {
  /** Copy this axis's resolved value from the other endpoint… */
  match: 'from' | 'to';
  /** …then add this length (px number or CSS string). */
  offset?: ConnectorLength;
}

export interface ConnectorPoint {
  /** Horizontal position — a length, `{ id/ref, edge?, offset? }`, or `{ match, offset? }`. */
  x: ConnectorAxis;
  /** Vertical position — same forms as `x`. */
  y: ConnectorAxis;
  /** Direction the path leaves/enters this point for `curved` & `elbow`; ignored by `straight`. */
  side?: ConnectorSide;
}
/** @deprecated renamed to {@link ConnectorPoint} (now per-axis flexible). */
export type ConnectorCoordinatePoint = ConnectorPoint;

export interface ConnectorAnchorPoint {
  /** `id` of the element to attach to — survives the `.astro` / MDX / React-island boundary. */
  id: string;
  side?: ConnectorSide;
  /** Where along that edge to attach — `'start'`/`'center'`/`'end'` or a `0`–`1` fraction. Default `'center'`. */
  align?: ConnectorAlign;
}
export interface ConnectorRefPoint {
  ref: RefObject<Element | null>;
  side?: ConnectorSide;
  /** Where along that edge to attach — `'start'`/`'center'`/`'end'` or a `0`–`1` fraction. Default `'center'`. */
  align?: ConnectorAlign;
}

/**
 * Either a per-axis {@link ConnectorPoint} (`{ x, y, side? }`, each axis a
 * length / element-anchored / matched to the other endpoint), or the
 * whole-element shorthands {@link ConnectorAnchorPoint} (`{ id, side?, align? }`)
 * / {@link ConnectorRefPoint} (`{ ref, side?, align? }`) that attach both axes
 * to one element's edge at once.
 */
export type ConnectorEndpoint = ConnectorPoint | ConnectorAnchorPoint | ConnectorRefPoint;

export interface ConnectorProps {
  /**
   * Start point. Either `{ x, y, side? }` where each axis is independently a
   * length (`120`, `'50%'`, `'calc(100% - 2rem)'`), an element-anchored value
   * (`{ id: 'foo', edge: 'end', offset: -24 }`), or `{ match: 'to', offset }`
   * to copy the other endpoint's same axis; or the shorthands `{ id, side?,
   * align? }` / `{ ref, side?, align? }` that attach both axes to one element.
   */
  from: ConnectorEndpoint;
  /** End point — same forms as `from`. The default arrowhead sits here. */
  to: ConnectorEndpoint;
  /**
   * Path routing, mirroring FigJam's three connector types. Default `curved`.
   * - `curved` — one cubic Bézier; control handles pushed off each endpoint
   *   along its `side` normal, scaled by `curvature`.
   * - `elbow` — orthogonal H/V routing, corners rounded by `cornerRadius`.
   *   When `from.side` and `to.side` are on different axes (e.g. `top` →
   *   `right`) it's a single 90° L; otherwise a 3-segment Z through a
   *   midpoint seam.
   * - `straight` — a single `M…L…` segment.
   */
  shape?: ConnectorShape;
  /**
   * The closed visual style set. Each bundles a stroke colour token, weight,
   * dash pattern and default start/end caps. Default `neutral`.
   * - `flow` — emerald, 2px, solid, →arrow. Sequential steps / before-after.
   * - `prototype` — blue, 1.5px, solid, dot→triangle. A navigation link, à la
   *   Figma prototype connections.
   * - `reference` — purple, 1.5px, dashed, →arrow. A loose cross-reference.
   * - `neutral` — chrome hairline, 1px, solid, →arrow.
   *
   * Colour is folded entirely into `variant` — there is no `palette` prop. For
   * a one-off colour, pass `[stroke:var(--…)]` via `className`.
   */
  variant?: ConnectorVariant;
  /** Start-point cap. Defaults to the `variant`'s start cap. */
  startCap?: ConnectorCap;
  /** End-point cap. Defaults to the `variant`'s end cap. */
  endCap?: ConnectorCap;
  /** `curved` only. Control-handle length as a fraction of the chord (0–1). Default 0.5. */
  curvature?: number;
  /** `elbow` only. Corner radius in px, auto-clamped to half the shorter leg. Default 8; 0 = sharp. */
  cornerRadius?: number;
  /**
   * Accessible name. When set, the `<svg>` is exposed as `role="img"` with
   * this label; otherwise the connector is `aria-hidden` (decorative).
   */
  'aria-label'?: string;
  /**
   * A FigJam-style annotation drawn *on* the line — a small pill filled with
   * the `variant`'s colour, centred on the path. Decorative (`aria-hidden`);
   * use `aria-label` for the accessible name.
   */
  label?: ReactNode;
  /**
   * Where the `label` sits along the path — a `0`–`1` fraction or a
   * percentage string (`'50%'`) of the total length. Default `'50%'`.
   */
  labelAt?: number | string;
  /** Threaded last onto the `label` pill — colour / size / offset one-offs. */
  labelClassName?: string;
  /** Threaded last onto the `<path>` — stroke/dash one-offs. */
  className?: string;
  /**
   * Stacking + visibility for the connector as a whole — applied to the root
   * `<svg>` *and* the on-line `label` pill, so a `z-*` keeps them on the same
   * layer (the pill, DOM-later, stays on top of the line) and a
   * `hidden`/`lg:block` toggles both together.
   */
  svgClassName?: string;
}

// ---------------------------------------------------------------------------
// Style set — the closed `variant` map (mirrors Tag/Surface). Colour arrives
// as two arbitrary-property classes: `[stroke:…]` for the line and `[color:…]`
// so the arrowhead's `currentColor` fallback resolves when `context-stroke`
// isn't honoured. Every token already has a `prefers-color-scheme: dark` value.
// ---------------------------------------------------------------------------

interface ConnectorVariantSpec {
  strokeClass: string;
  /** Resting stroke width, as a Tailwind arbitrary class (so a caller's `className` can still override it). */
  weightClass: string;
  /** Stroke width on hover / keyboard focus — ~1px thicker, echoing `Artboard`'s hover/focus outline. Applied via `--connector-w-hover` in `Connector.css`. */
  hoverWidth: number;
  dashClass: string;
  /** `Tag` `palette` for the on-line `label` pill — the same colour as the stroke. */
  labelPalette: TagPalette;
  defaultStartCap: ConnectorCap;
  defaultEndCap: ConnectorCap;
}

const variantSpec: Record<ConnectorVariant, ConnectorVariantSpec> = {
  flow: {
    strokeClass: '[stroke:var(--color-selection-emerald)] [color:var(--color-selection-emerald)]',
    weightClass: '[stroke-width:2]',
    hoverWidth: 3,
    dashClass: '',
    labelPalette: 'emerald',
    defaultStartCap: 'none',
    defaultEndCap: 'arrow',
  },
  prototype: {
    strokeClass: '[stroke:var(--color-selection-blue)] [color:var(--color-selection-blue)]',
    weightClass: '[stroke-width:2]',
    hoverWidth: 2.5,
    dashClass: '',
    labelPalette: 'blue',
    defaultStartCap: 'dot',
    defaultEndCap: 'triangle',
  },
  reference: {
    strokeClass: '[stroke:var(--color-selection-purple)] [color:var(--color-selection-purple)]',
    weightClass: '[stroke-width:2]',
    hoverWidth: 2.5,
    dashClass: '[stroke-dasharray:4_4]',
    labelPalette: 'purple',
    defaultStartCap: 'none',
    defaultEndCap: 'arrow',
  },
  neutral: {
    strokeClass:
      '[stroke:var(--color-chrome-border-emphasis)] [color:var(--color-chrome-border-emphasis)]',
    weightClass: '[stroke-width:1.5]',
    hoverWidth: 2,
    dashClass: '',
    labelPalette: 'chrome',
    defaultStartCap: 'none',
    defaultEndCap: 'arrow',
  },
};

// ---------------------------------------------------------------------------
// Arrowheads — one <marker> per non-`none` cap, `context-stroke` so the head
// tracks the line colour automatically.
// ---------------------------------------------------------------------------

interface CapShape {
  viewBox: string;
  refX: number;
  refY: number;
  w: number;
  h: number;
  body: ReactNode;
}

// `w`/`h` are absolute px (see `markerUnits="userSpaceOnUse"` on the
// `<marker>`) so a cap keeps its size when the line thickens on hover/focus.
// The values are ~2× the old `strokeWidth`-relative ones, to match how they
// looked at a resting 2px stroke.
const capShape: Record<Exclude<ConnectorCap, 'none'>, CapShape> = {
  // `refX: 8` (not 9) seats the head a touch past the geometric endpoint so
  // it fully covers the stroke terminus — no line peeking out of the tip, no
  // gap before a dashed line's last dash.
  arrow: {
    viewBox: '0 0 10 10',
    refX: 8,
    refY: 5,
    w: 16,
    h: 16,
    body: (
      <path
        d="M1,1 L9,5 L1,9"
        fill="none"
        stroke="context-stroke"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  triangle: {
    viewBox: '0 0 10 10',
    refX: 8,
    refY: 5,
    w: 16,
    h: 16,
    body: <path d="M1,1 L9,5 L1,9 Z" fill="context-stroke" />,
  },
  dot: {
    viewBox: '0 0 10 10',
    refX: 5,
    refY: 5,
    w: 14,
    h: 14,
    body: <circle cx={5} cy={5} r={4} fill="context-stroke" />,
  },
  ring: {
    viewBox: '0 0 10 10',
    refX: 5,
    refY: 5,
    w: 16,
    h: 16,
    // Filled with the canvas colour (not `none`) so the line doesn't show
    // through the middle — a FigJam-style anchor dot.
    body: (
      <circle
        cx={5}
        cy={5}
        r={3.5}
        fill="var(--color-canvas-surface)"
        stroke="context-stroke"
        strokeWidth={1.25}
      />
    ),
  },
};

function ConnectorMarker({
  id,
  cap,
  position,
}: {
  id: string;
  cap: Exclude<ConnectorCap, 'none'>;
  position: 'start' | 'end';
}) {
  const s = capShape[cap];
  return (
    <marker
      id={id}
      viewBox={s.viewBox}
      refX={s.refX}
      refY={s.refY}
      markerWidth={s.w}
      markerHeight={s.h}
      // Absolute units — the cap keeps its size when the line thickens on
      // hover/focus; only the stroke changes width.
      markerUnits="userSpaceOnUse"
      orient={position === 'start' ? 'auto-start-reverse' : 'auto'}
    >
      {s.body}
    </marker>
  );
}

// ---------------------------------------------------------------------------
// Geometry — the first path math in the repo. Local to this file; extract to
// `@lib` only if a second consumer appears.
// ---------------------------------------------------------------------------

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const round = (n: number) => Math.round(n * 100) / 100;

function sideVector(s: ConnectorSide | undefined): Pt | null {
  switch (s) {
    case 'top':
      return { x: 0, y: -1 };
    case 'bottom':
      return { x: 0, y: 1 };
    case 'left':
      return { x: -1, y: 0 };
    case 'right':
      return { x: 1, y: 0 };
    default:
      return null;
  }
}

/** Fallback tangent when a `side` is unset: leave/enter along the dominant axis. */
function autoAxis(dx: number, dy: number, leaving: boolean): Pt {
  const horiz = Math.abs(dx) >= Math.abs(dy);
  const sx = Math.sign(dx) || 1;
  const sy = Math.sign(dy) || 1;
  return horiz ? { x: leaving ? sx : -sx, y: 0 } : { x: 0, y: leaving ? sy : -sy };
}

function buildStraight(a: Pt, b: Pt): string {
  return `M ${round(a.x)} ${round(a.y)} L ${round(b.x)} ${round(b.y)}`;
}

function buildCurved(
  a: Pt,
  b: Pt,
  aSide: ConnectorSide | undefined,
  bSide: ConnectorSide | undefined,
  curvature: number,
): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) * clamp(curvature, 0, 1);
  const na = sideVector(aSide) ?? autoAxis(dx, dy, true);
  const nb = sideVector(bSide) ?? autoAxis(dx, dy, false);
  const c1 = { x: a.x + na.x * dist, y: a.y + na.y * dist };
  const c2 = { x: b.x + nb.x * dist, y: b.y + nb.y * dist };
  return `M ${round(a.x)} ${round(a.y)} C ${round(c1.x)} ${round(c1.y)} ${round(c2.x)} ${round(
    c2.y,
  )} ${round(b.x)} ${round(b.y)}`;
}

function roundedPath(pts: Pt[], radius: number): string {
  let d = `M ${round(pts[0].x)} ${round(pts[0].y)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const next = pts[i + 1];
    const inLen = Math.hypot(cur.x - prev.x, cur.y - prev.y) || 1;
    const outLen = Math.hypot(next.x - cur.x, next.y - cur.y) || 1;
    const rad = Math.min(radius, inLen / 2, outLen / 2);
    const inDir = { x: (cur.x - prev.x) / inLen, y: (cur.y - prev.y) / inLen };
    const outDir = { x: (next.x - cur.x) / outLen, y: (next.y - cur.y) / outLen };
    const p1 = { x: cur.x - inDir.x * rad, y: cur.y - inDir.y * rad };
    const p2 = { x: cur.x + outDir.x * rad, y: cur.y + outDir.y * rad };
    d += ` L ${round(p1.x)} ${round(p1.y)} Q ${round(cur.x)} ${round(cur.y)} ${round(p2.x)} ${round(
      p2.y,
    )}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${round(last.x)} ${round(last.y)}`;
  return d;
}

function buildElbow(
  a: Pt,
  b: Pt,
  aSide: ConnectorSide | undefined,
  bSide: ConnectorSide | undefined,
  cornerRadius: number,
): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const aH = aSide === 'left' || aSide === 'right';
  const aV = aSide === 'top' || aSide === 'bottom';
  const bH = bSide === 'left' || bSide === 'right';
  const bV = bSide === 'top' || bSide === 'bottom';

  let pts: Pt[];
  if ((aV && bH) || (aH && bV)) {
    // Sides on different axes: a single 90° L — leave along `aSide`, arrive
    // along `bSide`, one corner where the two runs meet.
    const corner = aV ? { x: a.x, y: b.y } : { x: b.x, y: a.y };
    pts = [a, corner, b];
  } else {
    // Same axis (or a side unset): a 3-segment Z through the midpoint seam.
    const horizontal = aH && bH ? true : aV && bV ? false : Math.abs(dx) >= Math.abs(dy);
    pts = horizontal
      ? [a, { x: a.x + dx / 2, y: a.y }, { x: a.x + dx / 2, y: b.y }, b]
      : [a, { x: a.x, y: a.y + dy / 2 }, { x: b.x, y: a.y + dy / 2 }, b];
  }

  pts = pts.filter((p, i) => i === 0 || p.x !== pts[i - 1].x || p.y !== pts[i - 1].y);

  if (cornerRadius <= 0 || pts.length < 3) {
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${round(p.x)} ${round(p.y)}`).join(' ');
  }
  return roundedPath(pts, cornerRadius);
}

// ---------------------------------------------------------------------------

/**
 * A FigJam-style flowchart arrow / Figma-style prototype link — an SVG path
 * drawn between two points, with arrowheads and a small closed set of visual
 * styles.
 *
 * Renders an absolutely-positioned `<svg>` covering its nearest positioned
 * ancestor, so **wrap the region in `position: relative`** (same contract as
 * `Comment` / `Artboard`). Each endpoint is `{ x, y, side? }` where every
 * axis is independently a length (px / `%` / any CSS `calc()`·`var()`), an
 * element-anchored value (`{ id, edge?, offset? }`), or `{ match, offset? }`
 * to copy the other endpoint's same axis; the `{ id, side?, align? }` /
 * `{ ref, … }` shorthands still attach both axes to one element. Anchored /
 * measured values re-resolve on resize & scroll. Pass `label` for a
 * FigJam-style pill riding the line. Decorative by default (`aria-hidden`) —
 * pass `aria-label` for an accessible name.
 */
export function Connector({
  from,
  to,
  shape = 'curved',
  variant = 'neutral',
  startCap,
  endCap,
  curvature = 0.5,
  cornerRadius = 8,
  label,
  labelAt = '50%',
  labelClassName,
  className,
  svgClassName,
  'aria-label': ariaLabel,
}: ConnectorProps) {
  const rawId = useId();
  const uid = `connector-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const rootRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  const spec = variantSpec[variant];
  const sCap = startCap ?? spec.defaultStartCap;
  const eCap = endCap ?? spec.defaultEndCap;

  const { a, b } = useResolvedEndpoints(from, to, rootRef);
  const aSide = 'side' in from ? from.side : undefined;
  const bSide = 'side' in to ? to.side : undefined;

  const d =
    a && b
      ? shape === 'straight'
        ? buildStraight(a, b)
        : shape === 'elbow'
          ? buildElbow(a, b, aSide, bSide, cornerRadius)
          : buildCurved(a, b, aSide, bSide, curvature)
      : null;

  // The `label` pill rides the rendered path: sample its point at
  // `labelAt` of the total length once the `d` above is in the DOM.
  const [labelPos, setLabelPos] = useState<Pt | null>(null);
  useIsomorphicLayoutEffect(() => {
    const path = lineRef.current;
    if (label == null || !path || !d) {
      setLabelPos(null);
      return;
    }
    const total = path.getTotalLength();
    if (!total) {
      setLabelPos(null);
      return;
    }
    const raw = typeof labelAt === 'number' ? labelAt : (parseFloat(labelAt) || 0) / 100;
    const frac = Math.min(1, Math.max(0, raw));
    const p = path.getPointAtLength(total * frac);
    setLabelPos((prev) => (prev && prev.x === p.x && prev.y === p.y ? prev : { x: p.x, y: p.y }));
  }, [label, d, labelAt]);

  const labelled = Boolean(ariaLabel);
  const startId = `${uid}-start`;
  const endId = `${uid}-end`;

  return (
    <>
    <svg
      ref={rootRef}
      data-connector=""
      data-connector-variant={variant}
      data-connector-shape={shape}
      aria-hidden={labelled ? undefined : true}
      role={labelled ? 'img' : undefined}
      aria-label={ariaLabel}
      // Only a labelled connector joins the tab order; a decorative one still
      // thickens on hover (via the transparent hit-path below) but isn't a
      // focus target.
      tabIndex={labelled ? 0 : undefined}
      style={{ '--connector-w-hover': String(spec.hoverWidth) } as CSSProperties}
      className={cn(
        // `z-10` keeps the connector above ordinary canvas content (artboards,
        // prose) while still sitting under the app chrome (`z-30` rails). The
        // svg rectangle stays click-through (`pointer-events-none`); the
        // hit-path opts back in. `group` powers `group-focus-visible:` on the
        // line; `focus:outline-none` — the thicker stroke is the focus cue,
        // matching `Artboard`.
        'group pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible focus:outline-none',
        svgClassName,
      )}
    >
      {d && (
        <>
          <defs>
            {sCap !== 'none' && <ConnectorMarker id={startId} cap={sCap} position="start" />}
            {eCap !== 'none' && <ConnectorMarker id={endId} cap={eCap} position="end" />}
          </defs>
          {/* Transparent fat hit-path — a generous hover target for a hairline
              line, and the `peer` the visible line's hover width keys off. */}
          <path d={d} fill="none" stroke="transparent" strokeWidth={12} className="peer [pointer-events:stroke]" />
          <path
            ref={lineRef}
            d={d}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            markerStart={sCap !== 'none' ? `url(#${startId})` : undefined}
            markerEnd={eCap !== 'none' ? `url(#${endId})` : undefined}
            className={cn(
              'pointer-events-none',
              spec.strokeClass,
              spec.weightClass,
              spec.dashClass,
              className,
            )}
          />
        </>
      )}
    </svg>
    {label != null && labelPos && (
      <Tag
        variant="solid"
        palette={spec.labelPalette}
        aria-hidden="true"
        style={{ left: labelPos.x, top: labelPos.y }}
        className={cn(
          // Rides the line at `labelAt`, centred on that point, click-through.
          // `svgClassName` is applied here too so the pill shares the svg's
          // stacking + visibility — same `z-*`, so as the DOM-later sibling
          // it paints *over* the line, and any `hidden`/`lg:block` hides both.
          'pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap',
          svgClassName,
          labelClassName,
        )}
      >
        {label}
      </Tag>
    )}
    </>
  );
}
