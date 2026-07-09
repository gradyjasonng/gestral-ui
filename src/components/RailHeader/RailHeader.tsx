import type { ReactNode } from 'react';
import { Stack, Text, Card } from '@primitives';
import { cn } from '@lib/cn';

export interface RailHeaderProps {
  /** Left slot: logo link in SiteRail, back chevron button in CanvasRail */
  left?: ReactNode;
  /** Primary text — site name */
  title?: string;
  /** Secondary text below title — section name (e.g. "Blog") */
  subtitle?: string;
  /**
   * Thumbnail content (e.g. the same image `PreviewCard` uses) rendered
   * above the title/subtitle row. Wrapped in a plain, non-interactive
   * `Card` — full-bleed against the rail's edges (no rounding, no side/top
   * border) so it reads as a header banner rather than a card floating
   * inside the rail. `className` (e.g. CanvasRail's `pl-sp-md`) only
   * affects the title/subtitle row below, not this banner.
   */
  above?: ReactNode;
  className?: string;
}

export function RailHeader({ left, title, subtitle, above, className }: RailHeaderProps) {
  const row = (
    <Stack direction="row" align="stretch" className={cn('shrink-0 min-h-14 px-sp-md', above && 'rounded-t-2xl', className)}>
      {left && (
        <Stack direction="row" align="center" justify="center" className="w-14 -ml-sp-md shrink-0">
          {left}
        </Stack>
      )}
      {(title || subtitle) && (
        <Stack direction="col" justify="center" className="py-3 flex-1 min-w-0 pr-3">
          {title && (
            <Text variant={subtitle ? "displaySm" : "displayMd"} className="text-chrome-text-primary truncate leading-5 translate-y-px">
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

  if (!above) return row;

  return (
    <Stack direction="col">
      <Card elevation="flat" className="relative aspect-video shrink-0 overflow-hidden border-0 rounded-none border-b border-chrome-border">
        {above}
        {/* Tones down the thumbnail so it doesn't compete with the title/subtitle row directly below it — darkest in the middle/top, lighter at the bottom edge so it doesn't muddy the border into the row below. */}
        <div className="absolute inset-0 bg-linear-to-b from-black/10 to-black/30" aria-hidden="true" />
      </Card>
      {row}
    </Stack>
  );
}
