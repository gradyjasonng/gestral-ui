import type { ReactNode } from 'react';
import { Stack } from '../Stack/Stack';
import { cn } from '../../lib/cn';

export interface RailProps {
  children: ReactNode;
  width?: string;
  /** Accessible label for the aside landmark (required when multiple Rails are on a page) */
  'aria-label'?: string;
  className?: string;
  /** When false, renders as a flex child instead of position:fixed — use inside Sidebar */
  fixed?: boolean;
}

export function Rail({ children, width = 'w-12', className, 'aria-label': ariaLabel, fixed = true }: RailProps) {
  return (
    <Stack
      as="aside"
      aria-label={ariaLabel}
      className={cn(
        'shrink-0',
        'bg-chrome-surface border-r border-chrome-border overflow-y-auto',
        fixed ? 'fixed top-0 bottom-0' : 'self-stretch',
        width,
        className,
      )}
    >
      {children}
    </Stack>
  );
}
