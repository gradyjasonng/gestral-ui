import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@lib/cn';
import { Text } from '@primitives/Text/Text';

export type PopoverVariant = 'annotation';

export interface PopoverProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  children: ReactNode;
  /** Color scheme applied to the popover. Defaults to `'annotation'` (accent palette). */
  variant?: PopoverVariant;
  className?: string;
}

const variantClass: Record<PopoverVariant, string> = {
  annotation: 'bg-accent-subtle border-accent-border text-accent-text',
};

/**
 * A small floating note card. Purely presentational — positioning it
 * relative to whatever it annotates (e.g. as a `Comment`'s popover, or
 * absolutely positioned over other content) and controlling its open/closed
 * state is the caller's job.
 */
export function Popover({ children, variant = 'annotation', className, ...rest }: PopoverProps) {
  return (
    <Text as="small"
      variant="bodySmall"
      data-popover=""
      data-popover-variant={variant}
      className={cn(
        'block w-xs leading-snug p-2 rounded border shadow-xl',
        variantClass[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </Text>
  );
}
