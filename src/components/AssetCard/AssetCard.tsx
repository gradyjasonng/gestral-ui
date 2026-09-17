import type { ReactNode } from 'react';
import { cn } from '@lib/cn';
import { Text, Icon, type IconName, Stack } from '@primitives';
import type { PreviewCardPalette } from '@components/PreviewCard/PreviewCard';
import { ThumbnailChips } from '@components/PreviewCard/thumbnailChips';

const paletteThumbnailClasses: Record<PreviewCardPalette, string> = {
  accent: 'bg-accent-subtle',
  secondary: 'bg-secondary-subtle',
};

export interface AssetCardProps {
  title: string;
  /** Pinned as a chrome chip to the thumbnail's top-right corner — typically the publish date. */
  date?: string;
  /** Rendered inline after the title. */
  icon?: IconName;
  /** Body line below the title, clamped to two lines. */
  description?: string;
  /** Pinned as chrome chips to the thumbnail's bottom-right corner. */
  tags?: string[];
  /**
   * Color scheme applied to the thumbnail background — matches `PreviewCard`'s
   * `palette` so a `RailPageEntry`'s hover preview looks like the same card
   * seen on the blog/work index. Omit for a card with no category (e.g. an
   * external link), which falls back to a neutral bordered thumbnail.
   */
  palette?: PreviewCardPalette;
  /** Thumbnail content — any children, clipped to the thumbnail's aspect ratio. */
  children?: ReactNode;
  href: string;
  className?: string;
}

/**
 * A bare-thumbnail link for a narrow rail — the card itself *is* the
 * thumbnail (no border/background around it besides its own edge), with the
 * `date` and `tags` pinned as chrome chips to its top-right and bottom-right
 * corners and title/description stacked underneath, outside the thumbnail. A
 * single hover fill spans both the thumbnail and the text, evoking Figma's
 * Assets panel rather than a bordered `PreviewCard` grid tile.
 */
export function AssetCard({ title, date, icon, description, tags, palette, children, href, className }: AssetCardProps) {
  return (
    <a
      href={href}
      className={cn(
        'group block rounded-lg p-2 -m-2 no-underline hover:bg-chrome-surface-hover transition-colors',
        className,
      )}
    >
      <div
        className={cn(
          'relative w-full aspect-video overflow-clip rounded-lg',
          palette ? paletteThumbnailClasses[palette] : 'border border-chrome-border bg-chrome-muted',
        )}
      >
        {children}
        <ThumbnailChips date={date} tags={tags} />
      </div>

      <Stack direction="col" gap="xs" className="mt-2">
        <Stack direction="row" gap="xs" className="items-center">
          <Text variant="labelXSmall" as="h3" className="text-chrome-text-primary truncate">
            {title}
          </Text>
          {icon && <Icon name={icon} size="xs" className="text-chrome-text-muted shrink-0" />}
        </Stack>

        {description && (
          <Text variant="caption" as="div" className="text-chrome-text-muted line-clamp-2">
            {description}
          </Text>
        )}
      </Stack>
    </a>
  );
}
