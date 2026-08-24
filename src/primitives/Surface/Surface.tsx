import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@lib/cn';

/** Shadow depth. `flat` sits on the page (border only); `raised` and `floating` add progressively deeper shadows for content that sits above other content (e.g. a menu or a dragged item). */
export type SurfaceElevation = 'flat' | 'raised' | 'floating';

/** Token set for border/background/text defaults. `chrome`/`editorial` are the app-UI and long-form-content surfaces, always rendered statically; `accent`/`secondary`/`input` are the palette-toned surfaces (e.g. an annotation or nav-active state) and additionally respond to `active`/`on` — see below. */
export type SurfacePalette = 'chrome' | 'editorial' | 'accent' | 'secondary' | 'input';

/** The subset of `SurfacePalette` that responds to `active`/`on` — used by interactive controls like `Button`. */
export type SurfaceActivePalette = Extract<SurfacePalette, 'accent' | 'secondary' | 'input'>;

/** Background a `SurfaceActivePalette` surface sits on — controls its idle/hover colors so they read correctly against that backdrop. */
export type SurfaceOn = 'default' | 'muted';

const staticPaletteClass: Record<Extract<SurfacePalette, 'chrome' | 'editorial'>, string> = {
  chrome:    'bg-chrome-surface border-chrome-border text-chrome-text-primary',
  editorial: 'bg-editorial-surface border-canvas-border text-editorial-text-primary',
};

export const paletteTextClass: Record<SurfaceActivePalette, string> = {
  accent:    'text-accent-text',
  secondary: 'text-secondary-text',
  input:     'text-input-text',
};

/** Active fill per palette, on the default (unmuted) `on`. `secondary` reads as a solid fill; `accent`/`input` read as a subtle wash — matches each palette's existing usage (e.g. `SegmentedControl`). */
const paletteActiveClass: Record<SurfaceActivePalette, string> = {
  accent:    'bg-accent-active text-accent-text',
  secondary: 'bg-secondary-default text-white',
  input:     'bg-input-active text-input-text',
};

export const inactiveClass      = 'text-chrome-text-secondary hover:bg-chrome-surface-hover hover:text-chrome-text-primary';

/** Idle/hover styling for a surface sitting on a `chrome-muted` background — hovers to the dedicated `chrome-muted-hover` token instead of `chrome-surface-hover`, which reads too close to the muted backdrop to register as a hover state. */
export const inactiveMutedClass = 'text-chrome-text-secondary hover:bg-chrome-muted-hover hover:text-chrome-text-primary';

/** Active styling for a `SurfaceActivePalette`, given its `on` and `palette`. On a `muted` background it fills back to the unmuted `chrome-surface` (so the active fill lifts off the muted well) with the palette's text color instead of its usual fill. */
export function activeFillClass(palette: SurfaceActivePalette, on: SurfaceOn): string {
  return on === 'muted' ? `bg-chrome-surface ${paletteTextClass[palette]}` : paletteActiveClass[palette];
}

/** Styling for a `SurfaceActivePalette`'s nav-active (`active="secondary"`) state — a muted chrome fill with the given palette's text color. */
export function activeSecondaryClass(palette: SurfaceActivePalette): string {
  return `bg-chrome-active ${paletteTextClass[palette]}`;
}

function isActivePalette(palette: SurfacePalette): palette is SurfaceActivePalette {
  return palette === 'accent' || palette === 'secondary' || palette === 'input';
}

const elevationClass: Record<SurfaceElevation, string> = {
  flat: '',
  raised: 'shadow-md',
  floating: 'shadow-xl',
};

export interface SurfaceProps extends Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'> {
  palette?: SurfacePalette;
  elevation?: SurfaceElevation;
  /** Whether to render the palette's border. Defaults to `true`. */
  border?: boolean;
  /**
   * Interactive fill state, for the `accent`/`secondary`/`input` palettes: a
   * palette-toned active fill, a muted `chrome-active` fill for
   * `'secondary'`, or (the default, `false`) a hover-only idle state that
   * ignores `palette` entirely. Has no effect on `chrome`/`editorial`, which
   * always render their static resting look regardless of `active`/`on`.
   */
  active?: boolean | 'secondary';
  /**
   * Background this surface sits on — only affects the active-aware
   * palettes' idle-hover token and where the active fill lifts to. Defaults
   * to `'default'`.
   */
  on?: SurfaceOn;
  className?: string;
  children?: ReactNode;
  as?: ElementType;
}

/**
 * The generic bordered/elevated/palette-toned box other components (e.g.
 * `Card`) build on: palette-driven bg/border/text defaults plus an elevation
 * shadow. `chrome`/`editorial` are purely presentational — no interactivity
 * semantics live there. `accent`/`secondary`/`input` additionally respond to
 * `active`/`on`, covering the fill/hover states interactive controls like
 * `Button` need. No corner radius is applied; pass a `rounded-*` class via
 * `className` for that.
 */
export function Surface({ palette = 'chrome', elevation = 'flat', border = true, active = false, on = 'default', as: Tag = 'div', children, className, ...rest }: SurfaceProps) {
  const paletteClass = isActivePalette(palette)
    ? (active === 'secondary'
        ? activeSecondaryClass(palette)
        : active
          ? activeFillClass(palette, on)
          : on === 'muted' ? inactiveMutedClass : inactiveClass)
    : staticPaletteClass[palette];

  return (
    <Tag
      className={cn(
        border && 'border',
        paletteClass,
        elevationClass[elevation],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
