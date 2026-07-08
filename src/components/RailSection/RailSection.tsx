import type { ReactNode } from 'react';
import { Stack, Text } from '@primitives';
import { cn } from '@lib/cn';

export interface RailSectionProps {
  /** Section heading (e.g. "Layers", "Info", "Up Next") */
  label: string;
  children: ReactNode;
  className?: string;
}

export function RailSection({ label, children, className }: RailSectionProps) {
  return (
    <Stack direction="col" gap="none" className={cn('py-2', className)}>
      <Text variant="eyebrow" as="p" className="px-3 py-1.5 text-chrome-text-secondary select-none">
        {label}
      </Text>
      {children}
    </Stack>
  );
}
