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
  columns?: GridColumns;
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
 * Grid layout primitive: a fixed `columns` count, gap, and padding, all
 * driven by the same generated spacing-scale tokens (`gap-sp-*`/`p-sp-*`)
 * Stack uses — reach for this instead of Stack whenever content should wrap
 * into a fixed number of columns rather than a single row/column. `columns`
 * is a plain count rather than responsive breakpoints, matching Stack's own
 * lack of a built-in `sm:`/`lg:` story — pass a responsive override via
 * `className` (e.g. `className="lg:grid-cols-3"`) the same way you would
 * for Stack.
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
        columnsClass[columns],
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
