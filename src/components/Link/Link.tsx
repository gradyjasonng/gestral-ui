import type { AnchorHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Text, type TextVariant } from '../Text/Text';

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
      className={clsx(
        'cursor-pointer transition-colors',
        // Force all descendants to inherit the link's color, overriding Text's own color class.
        '**:text-inherit!',
        variant === 'underline' && [
          'text-foreground hover:text-accent-hover active:text-accent',
          'underline decoration-2 decoration-foreground-muted',
          'hover:decoration-accent-hover active:decoration-accent',
        ],
        variant === 'subtle' && [
          'text-foreground-muted hover:text-accent-hover active:text-accent',
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
