import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@lib/cn';

/** Shadow depth. `flat` sits on the page (border only); `raised` and `floating` add progressively deeper shadows for content that sits above other content (e.g. a menu or a dragged item). */
export type SurfaceElevation = 'flat' | 'raised' | 'floating';

/** Token set for border/background/text defaults. `chrome`/`editorial` are the app-UI and long-form-content surfaces; `accent`/`secondary`/`input` are the palette-toned surfaces (e.g. an annotation or nav-active state). */
export type SurfacePalette = 'chrome' | 'editorial' | 'accent' | 'secondary' | 'input';

const elevationClass: Record<SurfaceElevation, string> = {
  flat: '',
  raised: 'shadow-md',
  floating: 'shadow-xl',
};

const paletteClass: Record<SurfacePalette, string> = {
  chrome:    'bg-chrome-surface border-chrome-border text-chrome-text-primary',
  editorial: 'bg-editorial-surface border-canvas-border text-editorial-text-primary',
  accent:    'bg-accent-subtle border-accent-border text-accent-text',
  secondary: 'bg-secondary-subtle border-secondary-border text-secondary-text',
  input:     'bg-input-subtle border-input-border text-input-text',
};

export interface SurfaceProps extends Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'> {
  /** @figmaVariant */
  palette?: SurfacePalette;
  /** @figmaVariant */
  elevation?: SurfaceElevation;
  /**
   * Whether to render the palette's border. Defaults to `true`.
   * @figmaVariant
   */
  border?: boolean;
  className?: string;
  children?: ReactNode;
  as?: ElementType;
}

/**
 * The generic bordered/elevated/palette-toned box other components (e.g.
 * `Card`) build on: palette-driven bg/border/text defaults plus an elevation
 * shadow. Purely presentational — no interactivity semantics (tag inference,
 * hover states) live here, and no corner radius is applied; pass a
 * `rounded-*` class via `className` for that.
 */
export function Surface({ palette = 'chrome', elevation = 'flat', border = true, as: Tag = 'div', children, className, ...rest }: SurfaceProps) {
  return (
    <Tag
      className={cn(
        border && 'border',
        paletteClass[palette],
        elevationClass[elevation],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
