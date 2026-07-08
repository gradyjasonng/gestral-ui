import type { ReactNode } from 'react';
import { Stack } from '@primitives/Stack/Stack';
import { cn } from '@lib/cn';

export interface RailProps {
  children: ReactNode;
  width?: string;
  /** Accessible label for the aside landmark (required when multiple Rails are on a page) */
  'aria-label'?: string;
  className?: string;
}

export function Rail({ children, width = 'w-12', className, 'aria-label': ariaLabel }: RailProps) {
  return (
    <Stack
      as="aside"
      aria-label={ariaLabel}
      className={cn(
        'shrink-0 self-stretch',
        'bg-chrome-surface border-r border-chrome-border overflow-y-auto',
        width,
        className,
      )}
    >
      {children}
    </Stack>
  );
}
