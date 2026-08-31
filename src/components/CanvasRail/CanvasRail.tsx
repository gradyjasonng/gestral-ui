import type { ReactNode } from 'react';
import { Stack } from '@primitives';
import { Rail } from '@components/Rail/Rail';
import { RailHeader } from '@components/RailHeader/RailHeader';
import { cn } from '@lib/cn';

export interface CanvasRailProps {
  title: string;
  /** Subtitle display name (e.g. "Blog") — maps to an item in SiteRail */
  subtitle?: string;
  /** Arbitrary content — typically one or more `RailSection`s (e.g. "Pages", "Layers") composed by the caller. */
  children?: ReactNode;
  className?: string;
}

/** The secondary, page-scoped rail: a title/subtitle header above whatever content the caller composes (e.g. `RailSection`s built from `PageList`/`LayerList`). Purely layout — CanvasRail has no opinion on what a "page" or "layer" is. Paired with `Canvas` to navigate within a single page. */
export function CanvasRail({ title, subtitle, children, className }: CanvasRailProps) {
  return (
    <Rail width="w-[min(25vw,16rem)]" aria-label="Section navigation" className={cn(className)}>
      <RailHeader title={title} subtitle={subtitle} />
      <hr className="border-chrome-border" />

      <Stack direction="col" gap="xs" padding="xs">
        {children}
      </Stack>

      <div className="flex-1" />
    </Rail>
  );
}
