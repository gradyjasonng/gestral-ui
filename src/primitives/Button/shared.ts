import type { TextVariant } from '../Text/Text';
import type { StackPadding } from '../Stack/Stack';

export type ButtonSize = 'sm' | 'md' | 'lg';

export const buttonToIconSizeMap = { sm: 'xs', md: 'sm', lg: 'md' } as const;

export const textVariantMap: Record<ButtonSize, TextVariant> = {
  sm: 'caption',
  md: 'bodySmall',
  lg: 'bodySmall',
};

/** Symmetric padding around a standalone icon fill, scaled with `size`. */
export const iconPaddingMap: Record<ButtonSize, StackPadding> = { sm: 'xs', md: 'sm', lg: 'md' };

const textButtonLineHeightMap: Record<ButtonSize, string> = {
  sm: 'var(--leading-caption)',
  md: 'var(--leading-body-sm)',
  lg: 'var(--leading-body-sm)',
};

/** Vertical padding applied to text buttons — fixed, not scaled with `size`. */
const textButtonPaddingVar = 'var(--spacing-stack-sm)';

/** Height of a text button at each size (line-height + padding), so `iconOnly` buttons can match it. */
export const buttonHeightMap: Record<ButtonSize, string> = {
  sm: `calc(${textButtonLineHeightMap.sm} + ${textButtonPaddingVar} * 2)`,
  md: `calc(${textButtonLineHeightMap.md} + ${textButtonPaddingVar} * 2)`,
  lg: `calc(${textButtonLineHeightMap.lg} + ${textButtonPaddingVar} * 2)`,
};

export const activeClass          = 'bg-accent-active text-accent-text';
export const activeSecondaryClass = 'bg-chrome-active text-chrome-text-primary';
export const inactiveClass        = 'text-chrome-text-secondary hover:bg-chrome-surface-hover hover:text-chrome-text-primary';
