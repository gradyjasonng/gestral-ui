import type { ReactNode } from 'react';
import { Stack } from '../../primitives/Stack/Stack';
import { cn } from '../../lib/cn';

export interface SidebarProps {
  overline?: ReactNode;
  main: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Sidebar({ overline, main, footer, className }: SidebarProps) {
  return (
    <Stack direction="col" className={cn('fixed top-0 bottom-0 left-0 bg-chrome-surface', className)}>
      {overline && <div className="shrink-0">{overline}</div>}
      <Stack direction="row" className="flex-1 min-h-0">{main}</Stack>
      {footer && <div className="shrink-0 border-t border-chrome-border">{footer}</div>}
    </Stack>
  );
}
