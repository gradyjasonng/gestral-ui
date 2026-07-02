import { Text } from '../../primitives/Text/Text';
import { cn } from '../../lib/cn';

export type FrameLabelSize = 'sm' | 'xs';

export interface FrameLabelProps {
  label: string;
  size?: FrameLabelSize;
  className?: string;
}

export function FrameLabel({ label, size = 'sm', className }: FrameLabelProps) {
  return (
    <Text
      variant="displaySm"
      as="span"
      className={cn(
        'inline-flex items-center gap-1.5 tracking-widest text-accent-text select-none',
        size === 'sm' ? 'text-[11px]' : 'text-[10px]',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'shrink-0 border border-accent-default',
          size === 'sm' ? 'w-2.5 h-2.5' : 'w-2 h-2',
        )}
      />
      {label}
    </Text>
  );
}
