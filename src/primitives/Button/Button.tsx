import { type ButtonHTMLAttributes, type CSSProperties, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@lib/cn';
import { Stack } from '@primitives/Stack/Stack';
import { Text } from '@primitives/Text/Text';
import { Icon, type IconName } from '@primitives/Icon/Icon';
import {
  type ButtonSize,
  type ButtonPalette,
  buttonToIconSizeMap,
  textVariantMap,
  buttonHeightMap,
  activeFillClass,
  activeSecondaryClass,
  inactiveClass,
  inactiveMutedClass,
} from './shared';

export type { ButtonSize, ButtonPalette } from './shared';
export type ButtonVariant = 'horizontal' | 'vertical' | 'iconOnly';
/** Which background the button sits on — controls idle/hover colors so they read correctly against that backdrop. */
export type ButtonSurface = 'default' | 'muted';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Controls padding and text size */
  size?: ButtonSize;
  /** Controls icon container size. Defaults to `size`. */
  iconSize?: ButtonSize;
  active?: boolean | 'secondary';
  /** Color scheme applied when `active`. Defaults to `'accent'`. */
  palette?: ButtonPalette;
  /** Background the button is rendered on, e.g. `'muted'` for a `chrome-muted` well. Defaults to `'default'`. */
  surface?: ButtonSurface;
  /** Renders as <a> when provided */
  href?: string;
  icon?: IconName;
  /** Arbitrary icon content (e.g. a site-specific SVG) sized to match `icon`. Takes precedence over `icon` when both are given. */
  customIcon?: ReactNode;
  /** Which side of the label the icon renders on. Ignored by `iconOnly`. Defaults to `'before'`. */
  iconPosition?: 'before' | 'after';
}

const base = 'rounded-sm cursor-pointer select-none';

/** Renders `customIcon` (sized to match `icon`'s box) when given, falling back to the named `icon`. */
function renderIcon(icon: IconName | undefined, customIcon: ReactNode | undefined, size: ButtonSize) {
  if (customIcon != null) {
    const sizeVar = `var(--icon-size-${buttonToIconSizeMap[size]})`;
    return (
      <span className="shrink-0 inline-flex items-center justify-center" style={{ width: sizeVar, height: sizeVar }}>
        {customIcon}
      </span>
    );
  }
  return icon ? <Icon name={icon} size={buttonToIconSizeMap[size]} /> : null;
}

export interface IconFillProps extends HTMLAttributes<HTMLDivElement> {
  icon?: IconName;
  /** Arbitrary icon content (e.g. a site-specific SVG) sized to match `icon`. Takes precedence over `icon` when both are given. */
  customIcon?: ReactNode;
  size?: ButtonSize;
  /** Controls icon size. Defaults to `size`. */
  iconSize?: ButtonSize;
  active?: boolean | 'secondary';
  /** Color scheme applied when `active`. Defaults to `'accent'`. */
  palette?: ButtonPalette;
  /** Background the icon fill is rendered on. Defaults to `'default'`. */
  surface?: ButtonSurface;
  style?: CSSProperties;
}

/**
 * The square icon fill used by `Button`'s `iconOnly` variant. Renders as a
 * plain, non-interactive `<div>` so it can also be nested inside another
 * interactive element (e.g. `LabelledIconButton`) without producing invalid
 * nested buttons/anchors.
 */
export function IconFill({ icon, customIcon, size = 'md', iconSize, active = false, palette = 'accent', surface = 'default', className, style, ...props }: IconFillProps) {
  const effectiveIconSize = iconSize ?? size;
  const iconEl = renderIcon(icon, customIcon, effectiveIconSize);
  const fillClass = active === 'secondary'
    ? activeSecondaryClass(palette)
    : active
      ? activeFillClass(palette, surface)
      : surface === 'muted' ? inactiveMutedClass : inactiveClass;

  return (
    <Stack
      direction="row"
      align="center"
      justify="center"
      className={cn(base, 'aspect-square', fillClass, className)}
      style={{ height: buttonHeightMap[size], ...style }}
      {...props}
    >
      {iconEl}
    </Stack>
  );
}

/** Applied whenever `disabled` is true, on top of any active/palette/surface styling — dims the button and blocks interaction regardless of those other states. */
const disabledClass = 'opacity-40 pointer-events-none cursor-not-allowed';

export function Button({
  variant = 'horizontal',
  size = 'md',
  iconSize,
  active = false,
  palette = 'accent',
  surface = 'default',
  href,
  icon,
  customIcon,
  iconPosition = 'before',
  className,
  style,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Tag = (href ? 'a' : 'button') as ElementType;
  const effectiveIconSize = iconSize ?? size;
  const iconEl = renderIcon(icon, customIcon, effectiveIconSize);
  const fillClass = active === 'secondary'
    ? activeSecondaryClass(palette)
    : active
      ? activeFillClass(palette, surface)
      : surface === 'muted' ? inactiveMutedClass : inactiveClass;
  const textVariant = textVariantMap[size];

  /* ── iconOnly: the height of the button is still fixed to what it would if it had text ── */
  if (variant === 'iconOnly') {
    return (
      <Tag href={href} disabled={disabled} {...props}>
        <IconFill icon={icon} customIcon={customIcon} size={size} iconSize={iconSize} active={active} palette={palette} surface={surface} className={cn(className, disabled && disabledClass)} style={style} />
      </Tag>
    );
  }

  const isVertical = variant === 'vertical';

  return (
    <Tag href={href} disabled={disabled} {...props}>
      <Stack
        direction={isVertical ? 'col' : 'row'}
        gap="sm"
        align="center"
        padding="sm"
        className={cn(
          base,
          'w-full',
          fillClass,
          disabled && disabledClass,
          className,
        )}
        style={style}
      >
        {iconPosition === 'before' && iconEl}
        {children != null && (
          <Text variant={textVariant} as="span" className={cn(!isVertical && 'flex-1 truncate')}>
            {children}
          </Text>
        )}
        {iconPosition === 'after' && iconEl}
      </Stack>
    </Tag>
  );
}
