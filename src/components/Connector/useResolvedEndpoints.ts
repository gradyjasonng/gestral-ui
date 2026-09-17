import { useEffect, useLayoutEffect, useState, type RefObject } from 'react';
import type {
  ConnectorAlign,
  ConnectorAxis,
  ConnectorAxisAnchor,
  ConnectorAxisMatch,
  ConnectorEndpoint,
  ConnectorLength,
  ConnectorPoint,
  ConnectorAnchorPoint,
  ConnectorRefPoint,
  ConnectorSide,
} from './Connector';

export interface Pt {
  x: number;
  y: number;
}

type Axis = 'x' | 'y';

/** `useLayoutEffect` on the client, `useEffect` on the server — avoids React's SSR warning when a gestral-ui island is server-rendered by Astro. */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// --- endpoint / axis shape guards -----------------------------------------

/** A per-axis `{ x, y, side? }` endpoint (as opposed to the `{ id }` / `{ ref }` whole-element shorthands). */
function isPoint(p: ConnectorEndpoint): p is ConnectorPoint {
  return 'x' in p && 'y' in p;
}
function isAnchorEndpoint(p: ConnectorEndpoint): p is ConnectorAnchorPoint {
  return 'id' in p && !('x' in p);
}
function isRefEndpoint(p: ConnectorEndpoint): p is ConnectorRefPoint {
  return 'ref' in p && !('x' in p);
}

function isAxisAnchor(a: ConnectorAxis): a is ConnectorAxisAnchor {
  return typeof a === 'object' && a !== null && ('id' in a || 'ref' in a);
}
function isAxisMatch(a: ConnectorAxis): a is ConnectorAxisMatch {
  return typeof a === 'object' && a !== null && 'match' in a;
}

// --- length resolution ---------------------------------------------------

const PLAIN_PX = /^-?\d*\.?\d+px?$/;
const PLAIN_PCT = /^-?\d*\.?\d+%$/;

/** A length that needs no DOM measurement — a number or a plain `px` string. */
function lengthIsStatic(v: ConnectorLength): boolean {
  return typeof v === 'number' || PLAIN_PX.test(v.trim());
}

function parsePx(v: ConnectorLength): number {
  return typeof v === 'number' ? v : parseFloat(v);
}

/**
 * Resolve a {@link ConnectorLength} to px. `%` uses `basis` (the ancestor's
 * width for `x`, height for `y`); every other unit (`rem`, `vw`, `calc()`,
 * `var()`) is measured off a throwaway element inside `ancestor` on the
 * matching dimension. A leading `-` on a measured string negates the result.
 */
function resolveLength(v: ConnectorLength, axis: Axis, basis: number, ancestor: HTMLElement): number {
  if (typeof v === 'number') return v;
  const s = v.trim();
  if (s === '') return 0;
  if (PLAIN_PX.test(s)) return parseFloat(s);
  if (PLAIN_PCT.test(s)) return (parseFloat(s) / 100) * basis;

  const negated = s.startsWith('-');
  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.left = '0';
  probe.style.top = '0';
  probe.style[axis === 'x' ? 'width' : 'height'] = negated ? s.slice(1) : s;
  ancestor.appendChild(probe);
  const rect = probe.getBoundingClientRect();
  ancestor.removeChild(probe);
  const px = axis === 'x' ? rect.width : rect.height;
  return negated ? -px : px;
}

// --- element edge maths -------------------------------------------------

interface LocalRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function edgeFraction(edge: ConnectorAxisAnchor['edge']): number {
  if (typeof edge === 'number') return clamp01(edge);
  if (edge === 'start') return 0;
  if (edge === 'end') return 1;
  return 0.5;
}

/** A point on `rect`'s edge, in the coordinate space `rect` is already expressed in. When `side` is omitted, the edge facing `toward` is used. */
function edgePoint(
  rect: LocalRect,
  side: ConnectorSide | undefined,
  align: ConnectorAlign,
  toward: Pt,
): Pt {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  let s = side;
  if (!s) {
    const dx = toward.x - cx;
    const dy = toward.y - cy;
    s = Math.abs(dx) >= Math.abs(dy) ? (dx >= 0 ? 'right' : 'left') : dy >= 0 ? 'bottom' : 'top';
  }

  const t =
    typeof align === 'number'
      ? clamp01(align)
      : align === 'start'
        ? 0
        : align === 'end'
          ? 1
          : 0.5;
  switch (s) {
    case 'top':
      return { x: rect.left + rect.width * t, y: rect.top };
    case 'bottom':
      return { x: rect.left + rect.width * t, y: rect.top + rect.height };
    case 'left':
      return { x: rect.left, y: rect.top + rect.height * t };
    case 'right':
      return { x: rect.left + rect.width, y: rect.top + rect.height * t };
  }
}

/**
 * The `<svg>`'s containing block — the nearest ancestor with a non-`static`
 * `position`, which is the coordinate origin for the absolutely-positioned
 * SVG. Falls back to the immediate parent (the caller is meant to make it
 * `position: relative`).
 */
function positionedAncestor(el: Element): HTMLElement | null {
  let cur = el.parentElement;
  while (cur) {
    const pos = getComputedStyle(cur).position;
    if (pos === 'relative' || pos === 'absolute' || pos === 'fixed' || pos === 'sticky') return cur;
    cur = cur.parentElement;
  }
  return el.parentElement;
}

// --- dependency keys ---------------------------------------------------

function axisKey(a: ConnectorAxis): string {
  if (isAxisMatch(a)) return `m|${a.match}|${String(a.offset ?? '')}`;
  if (isAxisAnchor(a)) return `n|${a.id ?? ''}|${a.ref ? 'ref' : ''}|${String(a.edge ?? '')}|${String(a.offset ?? '')}`;
  return `l|${String(a)}`;
}

/** Stable dependency key for an endpoint — everything the measurement depends on except a `ref`'s identity (handled separately). */
function endpointKey(p: ConnectorEndpoint): string {
  if (isAnchorEndpoint(p)) return `A|${p.id}|${p.side ?? ''}|${String(p.align ?? '')}`;
  if (isRefEndpoint(p)) return `R|${p.side ?? ''}|${String(p.align ?? '')}`;
  return `P|${axisKey(p.x)}|${axisKey(p.y)}|${p.side ?? ''}`;
}

function axisRef(p: ConnectorEndpoint, axis: Axis): RefObject<Element | null> | null {
  if (!isPoint(p)) return null;
  const a = p[axis];
  return isAxisAnchor(a) && a.ref ? a.ref : null;
}

// --- static fast path --------------------------------------------------

function axisIsStatic(a: ConnectorAxis): boolean {
  return (typeof a === 'number' || typeof a === 'string') && lengthIsStatic(a as ConnectorLength);
}
function isFullyStatic(from: ConnectorEndpoint, to: ConnectorEndpoint): boolean {
  return (
    isPoint(from) &&
    isPoint(to) &&
    axisIsStatic(from.x) &&
    axisIsStatic(from.y) &&
    axisIsStatic(to.x) &&
    axisIsStatic(to.y)
  );
}

/**
 * Resolves a `Connector`'s two endpoints to px coordinates in the space of the
 * SVG's nearest positioned ancestor.
 *
 * - **Static fast path**: when both endpoints are per-axis points whose `x`
 *   and `y` are all plain px/number lengths, they're resolved during render
 *   with no browser APIs — SSR paints the line immediately.
 * - **Measured path**: any element-anchored axis, `{ match }` axis, non-px
 *   length (`%`, `rem`, `calc()`, `var()`), or `{ id }` / `{ ref }` endpoint
 *   is measured against live rects and re-measured on `ResizeObserver`
 *   (observing the ancestor and every referenced element), `window` resize,
 *   and capture-phase scroll. Returns `{ a: null, b: null }` until the first
 *   measurement lands.
 */
export function useResolvedEndpoints(
  from: ConnectorEndpoint,
  to: ConnectorEndpoint,
  rootRef: RefObject<SVGSVGElement | null>,
): { a: Pt | null; b: Pt | null } {
  const isStatic = isFullyStatic(from, to);

  const [measured, setMeasured] = useState<{ a: Pt; b: Pt } | null>(null);

  const keyFrom = endpointKey(from);
  const keyTo = endpointKey(to);
  const refFrom = isRefEndpoint(from) ? from.ref : null;
  const refTo = isRefEndpoint(to) ? to.ref : null;
  const refFromX = axisRef(from, 'x');
  const refFromY = axisRef(from, 'y');
  const refToX = axisRef(to, 'x');
  const refToY = axisRef(to, 'y');

  useIsomorphicLayoutEffect(() => {
    if (isStatic) return;

    const svg = rootRef.current;
    if (!svg) return;
    const ancestor = positionedAncestor(svg);
    if (!ancestor) return;

    const elById = (id?: string) => (id ? document.getElementById(id) : null);
    const axisEl = (a: ConnectorAxis): Element | null =>
      isAxisAnchor(a) ? (elById(a.id) ?? a.ref?.current ?? null) : null;

    // Every element whose size/position feeds a measurement — observed below.
    const observed = new Set<Element>();
    const track = (el: Element | null) => {
      if (el) observed.add(el);
    };
    if (isAnchorEndpoint(from)) track(elById(from.id));
    if (isRefEndpoint(from)) track(from.ref.current);
    if (isPoint(from)) {
      track(axisEl(from.x));
      track(axisEl(from.y));
    }
    if (isAnchorEndpoint(to)) track(elById(to.id));
    if (isRefEndpoint(to)) track(to.ref.current);
    if (isPoint(to)) {
      track(axisEl(to.x));
      track(axisEl(to.y));
    }

    const measure = () => {
      const aRect = ancestor.getBoundingClientRect();
      const basisX = aRect.width;
      const basisY = aRect.height;
      const toLocal = (r: DOMRect): LocalRect => ({
        left: r.left - aRect.left,
        top: r.top - aRect.top,
        width: r.width,
        height: r.height,
      });

      /** One axis of a per-axis point, `null` for a `{ match }` axis (2nd pass). */
      const resolveAxis = (a: ConnectorAxis, axis: Axis): number | null => {
        if (isAxisMatch(a)) return null;
        if (isAxisAnchor(a)) {
          const el = axisEl(a);
          if (!el) return null;
          const lr = toLocal(el.getBoundingClientRect());
          const start = axis === 'x' ? lr.left : lr.top;
          const size = axis === 'x' ? lr.width : lr.height;
          const base = start + size * edgeFraction(a.edge);
          const basis = axis === 'x' ? basisX : basisY;
          return base + (a.offset != null ? resolveLength(a.offset, axis, basis, ancestor) : 0);
        }
        return resolveLength(a, axis, axis === 'x' ? basisX : basisY, ancestor);
      };

      /** Non-`match` resolution of an endpoint → a (possibly partial) point. */
      const pass1 = (p: ConnectorEndpoint, toward: Pt): { x: number | null; y: number | null } => {
        if (isPoint(p)) return { x: resolveAxis(p.x, 'x'), y: resolveAxis(p.y, 'y') };
        const el = isAnchorEndpoint(p) ? elById(p.id) : isRefEndpoint(p) ? p.ref.current : null;
        if (!el) return { x: null, y: null };
        const pt = edgePoint(toLocal(el.getBoundingClientRect()), p.side, p.align ?? 'center', toward);
        return { x: pt.x, y: pt.y };
      };

      const centre = { x: basisX / 2, y: basisY / 2 };
      const from1 = pass1(from, centre);
      const to1 = pass1(to, { x: from1.x ?? centre.x, y: from1.y ?? centre.y });
      // Second toward-pass for `from` now that `to` has a rough centre.
      const from1b = isPoint(from) ? from1 : pass1(from, { x: to1.x ?? centre.x, y: to1.y ?? centre.y });

      // 2nd pass: `{ match }` axes copy the *other* endpoint's resolved value.
      const matchAxis = (
        own: ConnectorEndpoint,
        axis: Axis,
        otherVal: number | null,
      ): number | null => {
        if (!isPoint(own)) return null;
        const a = own[axis];
        if (!isAxisMatch(a)) return null;
        if (otherVal == null) return null;
        const basis = axis === 'x' ? basisX : basisY;
        return otherVal + (a.offset != null ? resolveLength(a.offset, axis, basis, ancestor) : 0);
      };

      const a: Pt | null =
        from1b.x != null || matchAxis(from, 'x', to1.x) != null
          ? {
              x: (matchAxis(from, 'x', to1.x) ?? from1b.x)!,
              y: (matchAxis(from, 'y', to1.y) ?? from1b.y)!,
            }
          : null;
      const b: Pt | null =
        to1.x != null || matchAxis(to, 'x', from1b.x) != null
          ? {
              x: (matchAxis(to, 'x', from1b.x) ?? to1.x)!,
              y: (matchAxis(to, 'y', from1b.y) ?? to1.y)!,
            }
          : null;

      if (!a || a.x == null || a.y == null || !b || b.x == null || b.y == null) {
        setMeasured(null);
        return;
      }
      setMeasured((prev) =>
        prev && prev.a.x === a.x && prev.a.y === a.y && prev.b.x === b.x && prev.b.y === b.y
          ? prev
          : { a, b },
      );
    };

    measure();

    // Call `measure` directly (not via rAF): rAF callbacks are paused in a
    // backgrounded tab, which would strand the connector at its first
    // measurement. `measure` is cheap (a few `getBoundingClientRect`s + math)
    // and `setMeasured` bails when the result is unchanged, so a scroll
    // storm doesn't cause redundant renders. Mirrors `ButtonWithPreviewCard`.
    const ro = new ResizeObserver(() => measure());
    ro.observe(ancestor);
    observed.forEach((el) => ro.observe(el));
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStatic, keyFrom, keyTo, refFrom, refTo, refFromX, refFromY, refToX, refToY, rootRef]);

  if (isStatic && isPoint(from) && isPoint(to)) {
    return {
      a: { x: parsePx(from.x as ConnectorLength), y: parsePx(from.y as ConnectorLength) },
      b: { x: parsePx(to.x as ConnectorLength), y: parsePx(to.y as ConnectorLength) },
    };
  }
  return measured ?? { a: null, b: null };
}
