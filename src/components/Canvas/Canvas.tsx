import type { ReactNode } from 'react';
import { cn } from '@lib/cn';

export interface CanvasProps {
  children?: ReactNode;
  className?: string;
}

/** Stubbed artboard area — the content region a Shell lays out alongside its rails */
export function Canvas({ children, className }: CanvasProps) {
  return (
    <div className={cn('min-w-0 bg-canvas-surface', className)}>
      {children}
    </div>
  );
}
