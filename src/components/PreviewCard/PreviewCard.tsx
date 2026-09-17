import type { ReactNode } from 'react';
import { cn } from '@lib/cn';
import { Text, Stack, Icon, type IconName } from '@primitives';
import { Card } from '@components/Card/Card';
import { ThumbnailChips } from './thumbnailChips';

export type PreviewCardPalette = 'accent' | 'secondary';

const paletteClasses: Record<PreviewCardPalette, string> = {
  accent: 'bg-accent-default text-white',
  secondary: 'bg-secondary-default text-white',
};

const paletteThumbnailClasses: Record<PreviewCardPalette, string> = {
  accent: 'bg-accent-subtle',
  secondary: 'bg-secondary-subtle',
};

export interface PreviewCardProps {
  title: string;
  description?: string;
  /** Pinned as a chrome chip to the thumbnail's top-right corner. */
  date?: string;
  /** Color scheme applied to `icon`'s background. */
  palette?: PreviewCardPalette;
  /** Renders to the left of the title, with a background of `palette`'s color. */
  icon?: IconName;
  /** Rendered as the first chip in the thumbnail's bottom-right stack, ahead of `tags`. */
  categoryLabel?: string;
  tags?: string[];
  /** Thumbnail content — any children, clipped to the thumbnail wrapper */
  children?: ReactNode;
  href: string;
  className?: string;
}

/**
 * The thumbnail + title/description grid card used for blog/work index
 * listings — a bordered `Card` with the thumbnail filling most of it, the
 * `date` and `categoryLabel`/`tags` pinned as chrome chips to its top-right
 * and bottom-right corners, and a title/description block below. Pass a
 * fixed-aspect-ratio `className` (e.g. `aspect-4/3`) so the thumbnail sizes
 * consistently — see `BlogCard`/`WorkCard`. For a bare-thumbnail link in a
 * narrow rail (no border around the text, a hover fill spanning image+text),
 * use `AssetCard` instead.
 */
export function PreviewCard({
  title,
  description,
  date,
  palette = 'accent',
  icon,
  categoryLabel,
  tags,
  children,
  href,
  className,
}: PreviewCardProps) {
  const paletteClassName = paletteClasses[palette];
  const thumbnailTags = [categoryLabel, ...(tags ?? [])].filter(Boolean) as string[];

  return (
    <Card
      href={href}
      className="group flex flex-col h-full overflow-hidden no-underline"
    >
      {/* Thumbnail — className (e.g. aspect-video) sizes this, not the card as a whole, so the title/description meta below sits outside the ratio instead of squeezing the image shorter than intended. */}
      <div className={cn('w-full relative min-h-0 overflow-clip', paletteThumbnailClasses[palette], className)}>
        {children}
        <ThumbnailChips date={date} tags={thumbnailTags} />
      </div>

      {/* Meta — flex-1 so it (not the aspect-ratio-locked thumbnail above)
          absorbs any extra height the grid stretches this card to, keeping
          cards in the same row bottom-aligned regardless of description length. */}
      <Stack direction="row" gap="md" className="p-4 flex-1">
        {icon && (
          <div className={cn('shrink-0 flex items-center justify-center h-7 aspect-square rounded-sm', paletteClassName)}>
            <Icon name={icon} size="sm" />
          </div>
        )}

        <Stack direction="col" gap="sm" className="min-w-0 flex-1">
          <Text variant="body" as="h3" className="font-bold text-chrome-text-primary leading-snug">
            {title}
          </Text>

          {description && (
            <Text variant="caption" className="text-chrome-text-secondary leading-relaxed">
              {description}
            </Text>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
