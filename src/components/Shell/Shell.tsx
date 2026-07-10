import type { ReactNode } from 'react';
import { Canvas } from '@components/Canvas/Canvas';
import { cn } from '@lib/cn';

export interface ShellProps {
  overline?: ReactNode;
  rails: ReactNode;
  canvas?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Shell({ overline, rails, canvas = <Canvas />, footer, className }: ShellProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto] h-dvh bg-chrome-surface',
        className,
      )}
    >
      {overline && <div className="col-span-2 shrink-0">{overline}</div>}
      <div className="col-start-1 row-start-2 hidden md:flex min-h-0 relative">
        {rails}
      </div>
      <div className="col-start-2 row-start-2 row-span-2 min-w-0 min-h-0 max-h-screen overflow-scroll">{canvas}</div>
      {footer && (
        <div className="col-start-1 row-start-3 hidden md:block border-t border-r border-chrome-border text-right shrink-0">
          {footer}
        </div>
      )}
    </div>
  );
}
