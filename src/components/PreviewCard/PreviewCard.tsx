import type { ReactNode } from 'react';
import { cn } from '@lib/cn';
import { Text, Stack, Icon, Card, type IconName } from '@primitives';

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
  /** Renders to the left of the title/subtitle, with a background of `palette`'s color */
  icon?: IconName;
  /** Rendered as the first tag, styled with `palette`'s color to distinguish it from `tags` */
  categoryLabel?: string;
  tags?: string[];
  /** Thumbnail content — any children, clipped to the aspect-video wrapper */
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
  palette = 'accent',
  icon,
  categoryLabel,
  tags,
  children,
  href,
  className,
}: PreviewCardProps) {
  const paletteClassName = paletteClasses[palette];

  return (
    <Card
      href={href}
      className={cn('group flex flex-col overflow-hidden no-underline max-w-lg aspect-4/3', className)}
    >
      {/* Thumbnail */}
      <div className={cn('w-full relative flex-1 min-h-0 overflow-clip', paletteThumbnailClasses[palette])}>
        {children}

        {(categoryLabel || (tags && tags.length > 0)) && (
          <Stack direction="row" gap="sm" wrap className="absolute bottom-0 left-0 px-4 py-3" as="ul">
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
          <Text variant="subheading3" as="h3" className="text-chrome-text-primary leading-snug">
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
