import { cn } from '../../lib/cn';
import { FrameLabel } from '../FrameLabel/FrameLabel';
import { Text } from '../../primitives/Text/Text';
import { Stack } from '../../primitives/Stack/Stack';

export type CardCategory = 'blog' | 'work';

export interface CardProps {
  title: string;
  description?: string;
  date: string;
  category: CardCategory;
  tags?: string[];
  thumbnail?: string;
  thumbnailAlt?: string;
  layerName?: string;
  href: string;
  className?: string;
}

export function Card({
  title,
  description,
  date,
  category,
  tags,
  thumbnail,
  thumbnailAlt = '',
  layerName,
  href,
  className,
}: CardProps) {
  return (
    <a
      href={href}
      className={cn(
        'group flex flex-col gap-3 no-underline',
        'transition-all duration-150',
        className,
      )}
    >
      {/* Thumbnail */}
      <div className="relative">
        {layerName && (
          <FrameLabel
            label={layerName}
            size="xs"
            className="absolute -top-5 left-0"
          />
        )}
        <div
          className={cn(
            'w-full aspect-video overflow-hidden rounded-sm',
            'bg-chrome-surface-hover',
            'group-hover:shadow-md transition-shadow duration-150',
          )}
        >
          {thumbnail && (
            <img
              src={thumbnail}
              alt={thumbnailAlt}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Meta */}
      <Stack direction="col" gap="sm">
        <Stack direction="row" gap="md" align="center">
          <Text
            variant="eyebrow"
            as="span"
            className={cn(
              'font-display px-1.5 py-0.5 rounded-sm',
              category === 'blog'
                ? 'bg-accent-subtle text-accent-text'
                : 'bg-category-work-subtle text-category-work-text',
            )}
          >
            {category === 'blog' ? 'Blog' : 'Work'}
          </Text>
          <Text variant="caption" className="text-canvas-text-muted">
            {date}
          </Text>
        </Stack>

        <Text variant="labelSmall" as="h3" className="text-canvas-text-primary leading-snug">
          {title}
        </Text>

        {description && (
          <Text variant="caption" className="text-canvas-text-secondary leading-relaxed">
            {description}
          </Text>
        )}

        {tags && tags.length > 0 && (
          <Stack direction="row" gap="sm" wrap className="mt-0.5" as="ul">
            {tags.map((tag) => (
              <Text
                key={tag}
                variant="eyebrow"
                as="li"
                className="tracking-wide text-chrome-text-secondary bg-chrome-border px-1.5 py-0.5 rounded-sm"
              >
                {tag}
              </Text>
            ))}
          </Stack>
        )}
      </Stack>
    </a>
  );
}
