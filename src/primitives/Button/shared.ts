import type { TextVariant } from '@primitives/Text/Text';
import type { StackPadding } from '@primitives/Stack/Stack';

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

/** Color scheme applied to a Button's active state. Defaults to `accent`. */
export type ButtonPalette = 'accent' | 'secondary' | 'input';

export const paletteTextClass: Record<ButtonPalette, string> = {
  accent:    'text-accent-text',
  secondary: 'text-secondary-text',
  input:     'text-input-text',
};

/** Active fill per palette, on the default (unmuted) surface. `secondary` reads as a solid fill; `accent`/`input` read as a subtle wash — matches each palette's existing usage (e.g. `SegmentedControl`). */
const paletteActiveClass: Record<ButtonPalette, string> = {
  accent:    'bg-accent-active text-accent-text',
  secondary: 'bg-secondary-default text-white',
  input:     'bg-input-active text-input-text',
};

export const inactiveClass        = 'text-chrome-text-secondary hover:bg-chrome-surface-hover hover:text-chrome-text-primary';

/** Idle/hover styling for a Button sitting on a `chrome-muted` background — hovers to the dedicated `chrome-muted-hover` token instead of `chrome-surface-hover`, which reads too close to the muted backdrop to register as a hover state. */
export const inactiveMutedClass   = 'text-chrome-text-secondary hover:bg-chrome-muted-hover hover:text-chrome-text-primary';

/** Active styling for a Button, given its `surface` and `palette`. On a `muted` surface it fills back to the unmuted `chrome-surface` (so the active segment lifts off the muted well) with the palette's text color instead of its usual fill. */
export function activeFillClass(palette: ButtonPalette, surface: 'default' | 'muted'): string {
  return surface === 'muted' ? `bg-chrome-surface ${paletteTextClass[palette]}` : paletteActiveClass[palette];
}

/** Styling for a Button's nav-active (`active="secondary"`) state — a muted chrome fill with the given palette's text color. */
export function activeSecondaryClass(palette: ButtonPalette): string {
  return `bg-chrome-active ${paletteTextClass[palette]}`;
}
