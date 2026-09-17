import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { Text } from '@primitives/Text/Text';
import { cn } from '@lib/cn';

export type TagVariant = 'floating' | 'inset' | 'solid';

/** Colour scheme for the `solid` variant — the same "selection" palette `Artboard`/`Connector` hint their kind of content with, plus `chrome` for a neutral fill. Ignored by `floating`/`inset`, which are always chrome-toned. */
export type TagPalette = 'chrome' | 'emerald' | 'blue' | 'purple';

const variantClass: Record<Exclude<TagVariant, 'solid'>, string> = {
  floating: 'bg-chrome-surface shadow-sm text-chrome-text-secondary',
  inset: 'border border-chrome-border bg-chrome-muted text-chrome-text-secondary',
};

const solidPaletteClass: Record<TagPalette, string> = {
  chrome: '[background:var(--color-chrome-border-emphasis)] text-white',
  emerald: '[background:var(--color-selection-emerald)] text-white',
  blue: '[background:var(--color-selection-blue)] text-white',
  purple: '[background:var(--color-selection-purple)] text-white',
};

export interface TagProps extends HTMLAttributes<HTMLElement> {
  /**
   * How the tag sits against its background:
   * - `floating` (default): an opaque `chrome-surface` fill plus a drop
   *   shadow, so it stays legible overlaying arbitrary imagery (a card
   *   thumbnail).
   * - `inset`: a plain border, no fill or shadow, for sitting inside a
   *   surface-coloured panel (a metadata list).
   * - `solid`: an opaque colour fill (see `palette`) with white text — a
   *   called-out annotation rather than metadata, e.g. a `Connector`'s
   *   on-line label.
   */
  variant?: TagVariant;
  /** Fill colour for the `solid` variant. Defaults to `chrome`. */
  palette?: TagPalette;
  /** Element to render. Defaults to `div`. */
  as?: ElementType;
  children: ReactNode;
}

/**
 * A compact, non-interactive label — a date or category chip. Shared by
 * `ThumbnailChips` (`floating`), `MetaList` (`inset`), and `Connector`'s
 * on-line annotation (`solid`): all the same element and size, styled
 * differently for where they sit. Text is rendered in the casing it's
 * passed — apply an `uppercase`/`lowercase` class per use. Display only — it
 * has no interactive affordances.
 */
export function Tag({ variant = 'floating', palette = 'chrome', as = 'div', className, children, ...props }: TagProps) {
  return (
    <Text
      as={as}
      variant="labelXSmall"
      className={cn(
        'rounded-sm px-sp-xs py-sp-2xs',
        variant === 'solid' ? solidPaletteClass[palette] : variantClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Text>
  );
}
