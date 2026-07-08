import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@lib/cn';
import { TEXT_SCALE, type TextVariant } from '@lib/textScale';

export type { TextVariant };

export interface TextProps extends Omit<ComponentPropsWithoutRef<'p'>, 'children' | 'className'> {
  variant?: TextVariant;
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function Text({ variant = 'body', children, className, as, ...rest }: TextProps) {
  const entry = TEXT_SCALE[variant];
  const Tag = as ?? entry.element;
  return (
    <Tag className={cn('tracking-normal m-0', `text-${entry.slug}`, entry.className, className)} {...rest}>
      {children}
    </Tag>
  );
}
