import type { ReactNode } from 'react';
import { cn } from '@lib/cn';
import { Text, Stack, Icon, Card, type IconName } from '@primitives';

export type PreviewCardPalette = 'accent' | 'secondary';

/**
 * `vertical` (default): thumbnail banner on top, title/date/description below —
 * the dense grid-listing shape used for blog posts.
 * `horizontal`: fixed-size thumbnail beside title/description/meta, spanning
 * the full width of its container — for listings that need room for more
 * metadata than a grid cell allows (e.g. case studies).
 */
export type PreviewCardLayout = 'vertical' | 'horizontal';

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
  /** An extra caption line rendered alongside `date` (joined with " · ") — e.g. "Role · Timeline" for a case study. Only shown in `horizontal` layout. */
  meta?: string;
  layout?: PreviewCardLayout;
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
 * The thumbnail + title/date/tags link card used for blog/work index
 * listings. Built on the `Card` primitive for its border/hover styling —
 * `href` is required (unlike `Card`, `PreviewCard` is always a link).
 */
export function PreviewCard({
  title,
  description,
  date,
  meta,
  layout = 'vertical',
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

  if (layout === 'horizontal') {
    return (
      <Card
        href={href}
        className={cn('group flex flex-col sm:flex-row w-full overflow-hidden no-underline', className)}
      >
        <div className={cn('w-full sm:w-1/2 shrink-0 overflow-clip', paletteThumbnailClasses[palette])}>
          {children}
        </div>

        <Stack direction="col" gap="md" padding="2xl" className="sm:w-1/2 min-w-0 justify-center">
          <Stack direction="row" gap="md" className="items-center">
            {icon && (
              <div className={cn('shrink-0 flex items-center justify-center h-7 aspect-square rounded-sm', paletteClassName)}>
                <Icon name={icon} size="sm" />
              </div>
            )}

            <Text variant="subheading1" as="h3" className="text-chrome-text-primary leading-snug">
              {title}
            </Text>
          </Stack>

          {description && (
            <Text variant="body" className="text-chrome-text-secondary">
              {description}
            </Text>
          )}

          {(date || meta) && (
            <Text variant="bodySmall" className="text-chrome-text-muted mb-sp-xs">
              {[date, meta].filter(Boolean).join(' · ')}
            </Text>
          )}

          {tagList}
        </Stack>
      </Card>
    );
  }

  return (
    <Card
      href={href}
      className={cn('group flex flex-col overflow-hidden no-underline', className)}
    >
      {/* Thumbnail */}
      <div className={cn('w-full relative flex-1 min-h-0 overflow-clip', paletteThumbnailClasses[palette])}>
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
