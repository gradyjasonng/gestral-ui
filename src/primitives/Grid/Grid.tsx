import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@lib/cn';
import { gapClass, paddingClass, type StackGap, type StackPadding } from '@primitives/Stack/Stack';

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6;
export type GridAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type GridJustify = 'start' | 'center' | 'end' | 'stretch';

const columnsClass: Record<GridColumns, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

function columnsClassName(columns: GridColumns | string): string {
  return typeof columns === 'number' ? columnsClass[columns] : columns;
}

const alignClass: Record<GridAlign, string> = {
  start:    'items-start',
  center:   'items-center',
  end:      'items-end',
  stretch:  'items-stretch',
  baseline: 'items-baseline',
};

const justifyClass: Record<GridJustify, string> = {
  start:   'justify-items-start',
  center:  'justify-items-center',
  end:     'justify-items-end',
  stretch: 'justify-items-stretch',
};

export interface GridProps extends HTMLAttributes<HTMLElement> {
  /**
   * A fixed column count (1–6), or a raw space-separated string of Tailwind
   * `grid-cols-*` utilities (with responsive prefixes, e.g.
   * `"grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"`) for anything that needs
   * to change per breakpoint. The string form is passed straight through as
   * literal classes rather than resolved through a lookup, specifically so
   * `sm:`/`lg:`/etc. work exactly as they would in a plain `className` —
   * unlike `gap`/`padding`, a fixed per-breakpoint token count isn't a
   * sensible default here, since how many columns collapse at which
   * breakpoint is inherently content-specific. Defaults to `2`.
   */
  columns?: GridColumns | string;
  gap?: StackGap;
  padding?: StackPadding;
  /** Cross-axis alignment of each item within its own cell (`align-items`). */
  align?: GridAlign;
  /** Inline-axis alignment of each item within its own cell (`justify-items`) — not to be confused with `justify-content`, which distributes the grid's own tracks rather than each item within them. */
  justify?: GridJustify;
  as?: ElementType;
  children: ReactNode;
}

/**
 * Grid layout primitive: `columns`, gap, and padding, the latter two driven
 * by the same generated spacing-scale tokens (`gap-sp-*`/`p-sp-*`) Stack
 * uses — reach for this instead of Stack whenever content should wrap into
 * columns rather than a single row/column. See `columns`' own doc comment
 * for the responsive string form.
 */
export function Grid({
  columns = 2,
  gap = 'none',
  padding,
  align,
  justify,
  as: Tag = 'div',
  className,
  children,
  ...props
}: GridProps) {
  return (
    <Tag
      className={cn(
        'grid',
        columnsClassName(columns),
        gapClass[gap],
        padding && paddingClass[padding],
        align && alignClass[align],
        justify && justifyClass[justify],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
