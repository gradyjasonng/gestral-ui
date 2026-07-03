import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Text } from '../../primitives/Text/Text';

/**
 * Hints at the kind of content the Artboard holds, via its hover/focus colour:
 * - `default` (emerald) — static content: prose, images, layout sections.
 * - `interactive` (blue) — embedded mini-apps or other live/interactive content.
 * - `external` (purple) — embedded third-party content, e.g. a Figma iframe.
 */
export type ArtboardVariant = 'default' | 'interactive' | 'external';

export interface ArtboardProps {
  /** Frame label shown above the content, evoking a Figma layer/artboard name. */
  label: string;
  /** Colour hint for the kind of content held. Defaults to `default`. */
  variant?: ArtboardVariant;
  /** The wrapped content — prose, an image, a mini-app, an iframe, etc. */
  children: ReactNode;
  className?: string;
}

const borderClass: Record<ArtboardVariant, string> = {
  default: 'group-hover:border-selection-emerald group-focus-within:border-selection-emerald',
  interactive: 'group-hover:border-selection-blue group-focus-within:border-selection-blue',
  external: 'group-hover:border-selection-purple group-focus-within:border-selection-purple',
};

const labelClass: Record<ArtboardVariant, string> = {
  default: 'group-hover:text-selection-emerald-text group-focus-within:text-selection-emerald-text',
  interactive: 'group-hover:text-selection-blue-text group-focus-within:text-selection-blue-text',
  external: 'group-hover:text-selection-purple-text group-focus-within:text-selection-purple-text',
};

/**
 * The main wrapper for content living on the Canvas — prose, images, mini-apps,
 * embedded iframes. Pure decoration: a neutral label and border that pick up a
 * colour variant on hover/focus-within, evoking a selected element in a design
 * tool rather than a traditional content container.
 */
export function Artboard({ label, variant = 'default', children, className }: ArtboardProps) {
  return (
    <div tabIndex={0} className={cn('group relative pt-6 outline-none', className)}>
      <Text
        variant="caption"
        as="span"
        className={cn(
          'absolute top-0 left-0 text-chrome-text-primary select-none',
          labelClass[variant],
        )}
      >
        {label}
      </Text>
      <div
        className={cn(
          'relative border border-transparent bg-transparent overflow-hidden w-full',
          borderClass[variant],
        )}
      >
        {children}
      </div>
    </div>
  );
}
