import type { ButtonHTMLAttributes, ElementType, ReactNode } from 'react';
import { cn } from '@lib/cn';

export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ChipSize;
  active?: boolean | 'secondary';
  href?: string;
  iconOnly?: boolean;
  icon?: ReactNode;
}

const sizeMap: Record<ChipSize, string> = {
  sm: 'h-6 px-2 text-xs',
  md: 'h-8 px-2.5 text-sm',
  lg: 'h-10 px-3 text-sm',
};

const base = 'inline-flex items-center gap-1.5 rounded-pill font-ui transition-colors duration-100 cursor-pointer';

const activeClass          = 'bg-accent-default text-white';
const activeSecondaryClass = 'bg-chrome-active text-chrome-text-primary';
const inactiveClass        = 'bg-chrome-border text-chrome-text-secondary hover:bg-chrome-border-emphasis hover:text-chrome-text-primary';

export function Chip({
  size = 'md',
  active = false,
  href,
  iconOnly = false,
  icon,
  className,
  children,
  ...props
}: ChipProps) {
  const Tag = (href ? 'a' : 'button') as ElementType;

  return (
    <Tag
      href={href}
      className={cn(
        base,
        sizeMap[size],
        active === 'secondary' ? activeSecondaryClass : active ? activeClass : inactiveClass,
        className,
      )}
      {...props}
    >
      {iconOnly ? (
        <>
          {icon}
          {children != null && <span className="sr-only">{children}</span>}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </Tag>
  );
}
