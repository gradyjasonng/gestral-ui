import type { ElementType, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type TextVariant =
  | 'hero'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'subheading1'
  | 'subheading2'
  | 'subheading3'
  | 'displaySm'
  | 'overline'
  | 'eyebrow'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'prose'
  | 'labelSmall'
  | 'labelXSmall';

const defaultElement: Record<TextVariant, ElementType> = {
  hero:        'h1',
  h1:          'h1',
  h2:          'h2',
  h3:          'h3',
  subheading1: 'h4',
  subheading2: 'h5',
  subheading3: 'h6',
  displaySm:   'span',
  overline:    'p',
  eyebrow:     'span',
  body:        'p',
  bodySmall:   'p',
  caption:     'span',
  prose:       'p',
  labelSmall:  'span',
  labelXSmall: 'span',
};

const variantClasses: Record<TextVariant, string> = {
  hero:        'font-display text-hero font-normal uppercase',
  h1:          'font-display text-h1 font-normal uppercase',
  h2:          'font-display text-h2 font-normal uppercase',
  h3:          'font-display text-h3 font-normal uppercase',
  subheading1: 'font-ui text-subheading-1 font-bold',
  subheading2: 'font-ui text-subheading-2 font-bold',
  subheading3: 'font-ui text-subheading-3 font-bold',
  // display font at label scale — used for site names, frame labels, badges
  displaySm:   'font-display text-display-sm font-normal uppercase tracking-wide',
  // large section overline
  overline:    'font-ui text-overline font-bold uppercase',
  // micro overline — section labels, metadata keys, category tags
  eyebrow:     'font-ui text-eyebrow font-bold uppercase tracking-widest',
  body:        'font-ui text-body font-normal',
  bodySmall:   'font-ui text-body-sm font-normal',
  // xs body weight — dates, descriptions, secondary chrome text
  caption:     'font-ui text-caption font-normal',
  prose:       'font-editorial text-prose font-normal',
  labelSmall:  'font-ui text-label-sm font-bold',
  labelXSmall: 'font-ui text-label-xs font-bold',
};

export interface TextProps {
  variant?: TextVariant;
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function Text({ variant = 'body', children, className, as }: TextProps) {
  const Tag = as ?? defaultElement[variant];
  return (
    <Tag className={cn('tracking-normal m-0', variantClasses[variant], className)}>
      {children}
    </Tag>
  );
}
