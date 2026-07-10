import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@lib/cn';

export type StackDirection = 'row' | 'col';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around';
export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type StackPadding =
  | 'none' | 'xs' | 'sm' | 'md' | 'lg'
  | 'xs-squish' | 'xs-stretch'
  | 'sm-squish' | 'sm-stretch'
  | 'md-squish' | 'md-stretch'
  | 'lg-squish' | 'lg-stretch';

const gapClass: Record<StackGap, string> = {
  none: 'gap-0',
  xs:   'gap-0.5',  // 2px  — hairline tight, compact lists
  sm:   'gap-1',    // 4px  — chrome elements, icon groups
  md:   'gap-2',    // 8px  — standard chrome spacing
  lg:   'gap-4',    // 16px — comfortable, form fields
  xl:   'gap-6',    // 24px — loose, layout-level gaps
};

const paddingClass: Record<StackPadding, string> = {
  none:          '',
  xs:            'py-[var(--spacing-sp-xs)] px-[var(--spacing-sp-xs)]', // 4px all sides
  sm:            'py-[var(--spacing-sp-sm)] px-[var(--spacing-sp-sm)]', // 8px all sides
  md:            'py-[var(--spacing-sp-md)] px-[var(--spacing-sp-md)]', // 12px all sides
  lg:            'py-[var(--spacing-sp-xl)] px-[var(--spacing-sp-xl)]', // 24px all sides
  'xs-squish':   'py-0 px-[var(--spacing-sp-xs)]',                                     // 0px vertical, 4px horizontal
  'xs-stretch':  'py-[var(--spacing-sp-xs)] px-0',                                     // 4px vertical, 0px horizontal
  'sm-squish':   'py-[var(--spacing-sp-xs)] px-[var(--spacing-sp-sm)]',                   // 4px vertical, 8px horizontal
  'sm-stretch':  'py-[var(--spacing-sp-sm)] px-[var(--spacing-sp-xs)]',                   // 8px vertical, 4px horizontal
  'md-squish':   'py-[var(--spacing-sp-sm)] px-[var(--spacing-sp-md)]',                   // 8px vertical, 12px horizontal
  'md-stretch':  'py-[var(--spacing-sp-md)] px-[var(--spacing-sp-sm)]',                   // 12px vertical, 8px horizontal
  'lg-squish':   'py-[var(--spacing-sp-lg)] px-[var(--spacing-sp-xl)]',                   // 16px vertical, 24px horizontal
  'lg-stretch':  'py-[var(--spacing-sp-xl)] px-[var(--spacing-sp-lg)]',                   // 24px vertical, 16px horizontal
};

const alignClass: Record<StackAlign, string> = {
  start:    'items-start',
  center:   'items-center',
  end:      'items-end',
  stretch:  'items-stretch',
  baseline: 'items-baseline',
};

const justifyClass: Record<StackJustify, string> = {
  start:   'justify-start',
  center:  'justify-center',
  end:     'justify-end',
  between: 'justify-between',
  around:  'justify-around',
};

export interface StackProps extends HTMLAttributes<HTMLElement> {
  direction?: StackDirection;
  gap?: StackGap;
  padding?: StackPadding;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  as?: ElementType;
  children: ReactNode;
}

export function Stack({
  direction = 'col',
  gap = 'none',
  padding,
  align,
  justify,
  wrap = false,
  as: Tag = 'div',
  className,
  children,
  ...props
}: StackProps) {
  return (
    <Tag
      className={cn(
        'flex',
        direction === 'col' ? 'flex-col' : 'flex-row',
        gapClass[gap],
        padding && paddingClass[padding],
        align && alignClass[align],
        justify && justifyClass[justify],
        wrap && 'flex-wrap',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
