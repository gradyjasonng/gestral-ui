import type { ReactNode } from 'react';
import { cn } from '@lib/cn';
import { Text, Stack, Icon, type IconName } from '@primitives';
import { Card } from '@components/Card/Card';

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
  date?: string;
  /** Color scheme applied to `icon`'s background and `categoryLabel` */
  palette?: PreviewCardPalette;
  /** Renders to the left of the title, with a background of `palette`'s color. */
  icon?: IconName;
  /** Rendered as the first tag, styled with `palette`'s color to distinguish it from `tags` */
  categoryLabel?: string;
  tags?: string[];
  /** Thumbnail content — any children, clipped to the thumbnail wrapper */
  children?: ReactNode;
  href: string;
  className?: string;
}

/**
 * The thumbnail + title/date/tags grid card used for blog/work index
 * listings — a bordered `Card` with the thumbnail filling most of it and a
 * title/date/tags meta block below. Pass a fixed-aspect-ratio `className`
 * (e.g. `aspect-4/3`) so the thumbnail sizes consistently — see `BlogCard`/
 * `WorkCard`. For a bare-thumbnail link in a narrow rail (no border around
 * the text, a hover fill spanning image+text), use `AssetCard` instead.
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
  const hasTags = Boolean(categoryLabel || (tags && tags.length > 0));

  const tagList = hasTags && (
    <Stack direction="row" gap="sm" wrap as="ul">
      {categoryLabel && (
        <Text
          key="category"
          variant="eyebrow"
          as="li"
          className={cn('px-1.5 py-0.5 rounded-sm', paletteClassName)}
        >
          {categoryLabel}
        </Text>
      )}
      {tags?.map((tag) => (
        <Text
          key={tag}
          variant="eyebrow"
          as="li"
          className="text-chrome-text-secondary bg-chrome-border px-1.5 py-0.5 rounded-sm"
        >
          {tag}
        </Text>
      ))}
    </Stack>
  );

  return (
    <Card
      href={href}
      className="group flex flex-col overflow-hidden no-underline"
    >
      {/* Thumbnail — className (e.g. aspect-video) sizes this, not the card as a whole, so the title/date/tags meta below sits outside the ratio instead of squeezing the image shorter than intended. */}
      <div className={cn('w-full relative min-h-0 overflow-clip', paletteThumbnailClasses[palette], className)}>
        {children}

        {hasTags && (
          <div className="absolute bottom-0 left-0 px-4 py-3">{tagList}</div>
        )}
      </div>

      {/* Meta */}
      <Stack direction="row" gap="md" className="p-4">
        {icon && (
          <div className={cn('shrink-0 flex items-center justify-center h-7 aspect-square rounded-sm', paletteClassName)}>
            <Icon name={icon} size="sm" />
          </div>
        )}

        <Stack direction="col" gap="sm" className="min-w-0 flex-1">
          <Text variant="body" as="h3" className="font-bold text-chrome-text-primary leading-snug">
            {title}
          </Text>

          {date && (
            <Text variant="caption" className="text-chrome-text-secondary">
              {date}
            </Text>
          )}

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
