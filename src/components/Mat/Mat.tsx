import type { ElementType, ReactNode, CSSProperties } from 'react';
import clsx from 'clsx';

const TICK_COUNT = 100;

const gridStyle: CSSProperties = {
  backgroundImage: [
    'repeating-linear-gradient(to right, var(--color-marking-faint) 0 1px, transparent 1px 1cm)',
    'repeating-linear-gradient(to bottom, var(--color-marking-faint) 0 1px, transparent 1px 1cm)',
  ].join(', '),
};

export interface MatProps {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}

export function Mat({ as: Tag = 'body', children, className }: MatProps) {
  return (
    <Tag
      className={clsx('relative min-h-dvh w-full bg-mat overflow-clip', className)}
      style={gridStyle}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {Array.from({ length: TICK_COUNT }, (_, i) => (
          <span
            key={`col-${i}`}
            className={clsx(
              'absolute font-sans font-extrabold text-marking leading-none whitespace-nowrap',
              'text-[10px] -translate-x-1/2',
              i === 0 && 'opacity-0',
            )}
            style={{ left: `${i}cm`, top: '0.35cm' }}
          >
            {i}
          </span>
        ))}
        {Array.from({ length: TICK_COUNT }, (_, i) => (
          <span
            key={`row-${i}`}
            className={clsx(
              'absolute font-sans font-extrabold text-marking leading-none whitespace-nowrap',
              'text-[10px] -translate-y-1/2',
              i === 0 && 'opacity-0',
            )}
            style={{ top: `${i}cm`, left: '0.35cm' }}
          >
            {i}
          </span>
        ))}
      </div>
      {children}
    </Tag>
  );
}
