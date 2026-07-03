import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface PageProps {
  children: ReactNode;
  className?: string;
}

const DEFAULT_WIDTH = 'w-[960px]';

/** Layout surface for top-level index pages (Home/Blog/Work) — pairs with an expanded SiteRail, no CanvasRail. */
export function Page({ children, className }: PageProps) {
  return (
    <div className={cn(DEFAULT_WIDTH, 'max-w-full mx-auto bg-chrome-surface text-chrome-text-primary', className)}>
      {children}
    </div>
  );
}
