import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Text } from '../../primitives/Text/Text';
import { Stack } from '../../primitives/Stack/Stack';

export type CardCategory = 'blog' | 'work';

export interface CardProps {
  title: string;
  description?: string;
  date: string;
  category: CardCategory;
  tags?: string[];
  /** Thumbnail content — any children, clipped to the aspect-video wrapper */
  children?: ReactNode;
  href: string;
  className?: string;
}

export function Card({
  title,
  description,
  date,
  category,
  tags,
  children,
  href,
  className,
}: CardProps) {
  return (
    <a
      href={href}
      className={cn(
        'group flex flex-col overflow-hidden no-underline rounded-lg border border-chrome-border bg-chrome-surface max-w-lg',
        'hover:border-selection-blue',
        className,
      )}
    >
      {/* Thumbnail */}
      <div className="w-full relative aspect-video overflow-clip bg-canvas-surface">
        {children}

        {tags && tags.length > 0 && (
          <Stack direction="row" gap="sm"wrap className="absolute bottom-0 left-0 px-4 py-3" as="ul">
            {tags.map((tag) => (
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
      <Stack direction="col" gap="sm" className="p-4">
        <Text variant="subheading3" as="h3" className="text-chrome-text-primary leading-snug">
          {title}
        </Text>

        <Text variant="caption" className="text-chrome-text-secondary">
          {date}
        </Text>

        {description && (
          <Text variant="caption" className="text-chrome-text-secondary leading-relaxed">
            {description}
          </Text>
        )}
      </Stack>
    </a>
  );
}
