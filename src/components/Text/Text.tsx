import type { ElementType, ReactNode } from 'react';
import clsx from 'clsx';

export type TextVariant =
  | 'hero'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'subheading1'
  | 'subheading2'
  | 'subheading3'
  | 'overline'
  | 'body'
  | 'bodySmall'
  | 'prose'
  | 'labelSmall'
  | 'labelXSmall';

const defaultElement: Record<TextVariant, ElementType> = {
  hero: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  subheading1: 'h4',
  subheading2: 'h5',
  subheading3: 'h6',
  overline: 'p',
  body: 'p',
  bodySmall: 'p',
  prose: 'p',
  labelSmall: 'span',
  labelXSmall: 'span',
};

const variantClasses: Record<TextVariant, string> = {
  hero:        'font-display text-9xl font-normal uppercase',
  h1:          'font-display text-8xl font-normal uppercase',
  h2:          'font-display text-7xl font-normal uppercase',
  h3:          'font-display text-6xl font-normal uppercase',
  subheading1: 'font-sans text-4xl font-bold',
  subheading2: 'font-sans text-2xl font-bold',
  subheading3: 'font-sans text-xl font-bold',
  overline:    'font-sans text-lg leading-5 font-bold uppercase',
  body:        'font-sans text-base font-normal',
  bodySmall:   'font-sans text-sm font-normal',
  prose:       'font-serif text-base leading-8 font-normal',
  labelSmall:  'font-sans text-sm leading-4 font-bold',
  labelXSmall: 'font-sans text-xs font-bold',
};

export interface TextProps {
  /** Visual style and semantic weight of the text. Determines default HTML element and Tailwind classes. */
  variant?: TextVariant;
  /** Text content to render. */
  children: ReactNode;
  /** Additional Tailwind classes merged onto the root element. */
  className?: string;
  /** Override the rendered HTML element. Defaults to the semantic element for the chosen variant. */
  as?: ElementType;
}

/** Typographic primitive. Renders text in one of the design system's named variants. */
export function Text({ variant = 'body', children, className, as }: TextProps) {
  const Tag = as ?? defaultElement[variant];
  return (
    <Tag className={clsx('text-foreground tracking-normal m-0', variantClasses[variant], className)}>
      {children}
    </Tag>
  );
}
