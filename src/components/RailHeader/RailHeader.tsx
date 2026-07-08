import type { ReactNode } from 'react';
import { Stack, Text } from '@primitives';
import { cn } from '@lib/cn';

export interface RailHeaderProps {
  /** Left slot: logo link in SiteRail, back chevron button in CanvasRail */
  left?: ReactNode;
  /** Primary text — site name */
  title?: string;
  /** Secondary text below title — section name (e.g. "Blog") */
  subtitle?: string;
  className?: string;
}

export function RailHeader({ left, title, subtitle, className }: RailHeaderProps) {
  return (
    <Stack direction="row" align="stretch" className={cn('shrink-0 min-h-14', className)}>
      {left && (
        <Stack direction="row" align="center" justify="center" className="w-14 shrink-0">
          {left}
        </Stack>
      )}
      {(title || subtitle) && (
        <Stack direction="col" justify="center" className="py-3 flex-1 min-w-0 pr-3">
          {title && (
            <Text variant={subtitle ? "displaySm" : "displayMd"} className="text-chrome-text-primary truncate leading-5">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text variant="caption" className="text-chrome-text-secondary truncate">
              {subtitle}
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  );
}
