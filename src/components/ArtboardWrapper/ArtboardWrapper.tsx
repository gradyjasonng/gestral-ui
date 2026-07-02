import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { FrameLabel } from '../FrameLabel/FrameLabel';

export interface ArtboardWrapperProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function ArtboardWrapper({ label, children, className }: ArtboardWrapperProps) {
  return (
    <div className={cn('relative pt-6', className)}>
      <FrameLabel
        label={label}
        size="sm"
        className="absolute top-0 left-0"
      />
      <div className="border border-accent-default rounded-sm bg-canvas-surface overflow-hidden w-full">
        {children}
      </div>
    </div>
  );
}
