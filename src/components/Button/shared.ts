import type { TextVariant } from '@primitives/Text/Text';
import type { StackPadding } from '@primitives/Stack/Stack';
import type { SurfaceActivePalette, SurfaceOn } from '@primitives/Surface/Surface';

export type { SurfaceActivePalette as ButtonPalette, SurfaceOn as ButtonSurface };
export {
  paletteTextClass,
  activeFillClass,
  activeSecondaryClass,
  inactiveClass,
  inactiveMutedClass,
} from '@primitives/Surface/Surface';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export const buttonToIconSizeMap = { sm: 'xs', md: 'sm', lg: 'md', xl: 'lg' } as const;

export const textVariantMap: Record<ButtonSize, TextVariant> = {
  sm: 'caption',
  md: 'bodySmall',
  lg: 'bodySmall',
  xl: 'bodySmall',
};

/** Symmetric padding around a standalone icon fill, scaled with `size`. */
export const iconPaddingMap: Record<ButtonSize, StackPadding> = { sm: 'xs', md: 'sm', lg: 'md', xl: 'lg' };

const textButtonLineHeightMap: Record<ButtonSize, string> = {
  sm: 'var(--leading-caption)',
  md: 'var(--leading-body-sm)',
  lg: 'var(--leading-body-sm)',
  xl: 'var(--leading-body-sm)',
};

/** Vertical padding applied to text buttons — fixed, not scaled with `size`. */
const textButtonPaddingVar = 'var(--spacing-sp-sm)';

/** Height of a text button at each size (line-height + padding), so `iconOnly` buttons can match it. */
export const buttonHeightMap: Record<ButtonSize, string> = {
  sm: `calc(${textButtonLineHeightMap.sm} + ${textButtonPaddingVar} * 2)`,
  md: `calc(${textButtonLineHeightMap.md} + ${textButtonPaddingVar} * 2)`,
  lg: `calc(${textButtonLineHeightMap.lg} + ${textButtonPaddingVar} * 2)`,
  xl: `calc(${textButtonLineHeightMap.xl} + ${textButtonPaddingVar} * 2)`,
};
