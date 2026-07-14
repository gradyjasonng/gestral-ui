import type { ElementType, ReactNode } from 'react';
import { cn } from '@lib/cn';
import './Prose.css';

export interface ProseProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

/** Applies the `.prose` article-typography styles (headings, links, lists, etc.) to arbitrary children — for long-form editorial content. */
export function Prose({ children, className, as: Tag = 'div' }: ProseProps) {
  return (
    <Tag className={cn('prose', className)}>
      {children}
    </Tag>
  );
}
