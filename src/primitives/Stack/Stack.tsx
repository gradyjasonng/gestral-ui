import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@lib/cn';

export type StackDirection = 'row' | 'col';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around';
export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type StackPadding =
  | 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  | 'xs-squish'  | 'xs-stretch'
  | 'sm-squish'  | 'sm-stretch'
  | 'md-squish'  | 'md-stretch'
  | 'lg-squish'  | 'lg-stretch'
  | 'xl-squish'  | 'xl-stretch'
  | '2xl-squish' | '2xl-stretch';

const gapClass: Record<StackGap, string> = {
  none:  'gap-0',
  xs:    'gap-sp-xs',
  sm:    'gap-sp-sm',
  md:    'gap-sp-md',
  lg:    'gap-sp-lg',
  xl:    'gap-sp-xl',
  '2xl': 'gap-sp-2xl'
};

const paddingClass: Record<StackPadding, string> = {
  none:          '',
  xs:            'p-sp-xs',
  sm:            'p-sp-sm',
  md:            'p-sp-md', 
  lg:            'p-sp-lg', 
  xl:            'p-sp-xl',
  '2xl':         'p-sp-2xl',
  'xs-squish':   'px-sp-xs py-sp-2xs',
  'xs-stretch':  'px-sp-xs py-sp-sm',
  'sm-squish':   'px-sp-sm py-sp-xs',
  'sm-stretch':  'px-sp-sm py-sp-md',
  'md-squish':   'px-sp-md py-sp-sm',
  'md-stretch':  'px-sp-md py-sp-lg',
  'lg-squish':   'px-sp-lg py-sp-md', 
  'lg-stretch':  'px-sp-lg py-sp-xl',
  'xl-squish':   'px-sp-xl py-sp-lg',
  'xl-stretch':  'px-sp-xl py-sp-2xl',
  '2xl-squish':  'px-sp-2xl py-sp-xl',
  '2xl-stretch': 'px-sp-2xl py-sp-3xl'
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

/** Flex layout primitive: direction, gap, padding, align, and justify, all driven by the generated spacing-scale tokens (`gap-sp-*`/`p-sp-*`). */
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
