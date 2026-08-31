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

/**
 * Typographic primitive: renders the semantic HTML element and size/weight/line-height
 * defined for `variant` in the generated text scale (`src/lib/textScale.ts`).
 *
 * `data-text` is a bare hook for other components to target actual text content
 * structurally (not by tag, since `as`/`variant` can render any element) — e.g.
 * `Artboard` underlines a `Text` that's its own immediate child on hover/focus,
 * evoking a Figma text frame. It carries no styling of its own.
 */
export function Text({ variant = 'body', children, className, as, ...rest }: TextProps) {
  const entry = TEXT_SCALE[variant];
  const Tag = as ?? entry.element;
  return (
    <Tag
      data-text=""
      className={cn('tracking-normal m-0', `text-${entry.slug}`, entry.className, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
