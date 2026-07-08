import type { ElementType, ReactNode } from 'react';
import { cn } from '@lib/cn';
import './Prose.css';

export interface ProseProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function Prose({ children, className, as: Tag = 'div' }: ProseProps) {
  return (
    <Tag className={cn('prose', className)}>
      {children}
    </Tag>
  );
}
