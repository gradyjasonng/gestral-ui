import type { AnchorHTMLAttributes } from 'react';
import { cn } from '@lib/cn';
import { Text, type TextVariant } from '@primitives';

export type LinkVariant = 'underline' | 'subtle';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Controls underline decoration and default color. Does not affect typography. */
  variant?: LinkVariant;
  /** When provided, wraps children in a Text component with this typographic variant. */
  textVariant?: TextVariant;
}

/**
 * Interactive anchor element. Typography is controlled via `textVariant` or by passing
 * a `<Text>` component as children. `variant` controls only decoration and color behavior.
 */
export function Link({ variant = 'underline', textVariant, className, children, ...props }: LinkProps) {
  const content = textVariant ? (
    <Text variant={textVariant} as="span">
      {children}
    </Text>
  ) : children;

  return (
    <a
      className={cn(
        'cursor-pointer',
        // Force all descendants to inherit the link's color, overriding Text's own color class.
        '**:text-inherit!',
        variant === 'underline' && [
          'text-canvas-text-primary hover:text-accent-default active:text-accent-text',
          'underline decoration-2 decoration-accent-default',
          'hover:decoration-accent-default active:decoration-accent-text',
        ],
        variant === 'subtle' && [
          'text-canvas-text-secondary hover:text-accent-default active:text-accent-text',
          'no-underline',
        ],
        className,
      )}
      {...props}
    >
      {content}
    </a>
  );
}
