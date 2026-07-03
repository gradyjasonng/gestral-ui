import { type ButtonHTMLAttributes, type CSSProperties, type ElementType, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { Icon, type IconName } from '../Icon/Icon';
import {
  type ButtonSize,
  buttonToIconSizeMap,
  textVariantMap,
  buttonHeightMap,
  activeClass,
  activeSecondaryClass,
  inactiveClass,
} from './shared';

export type { ButtonSize } from './shared';
export type ButtonVariant = 'horizontal' | 'vertical' | 'iconOnly';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Controls padding and text size */
  size?: ButtonSize;
  /** Controls icon container size. Defaults to `size`. */
  iconSize?: ButtonSize;
  active?: boolean | 'secondary';
  /** Renders as <a> when provided */
  href?: string;
  icon?: IconName;
}

const base = 'rounded-sm cursor-pointer select-none';

export interface IconFillProps extends HTMLAttributes<HTMLDivElement> {
  icon?: IconName;
  size?: ButtonSize;
  /** Controls icon size. Defaults to `size`. */
  iconSize?: ButtonSize;
  active?: boolean | 'secondary';
  style?: CSSProperties;
}

/**
 * The square icon fill used by `Button`'s `iconOnly` variant. Renders as a
 * plain, non-interactive `<div>` so it can also be nested inside another
 * interactive element (e.g. `LabelledIconButton`) without producing invalid
 * nested buttons/anchors.
 */
export function IconFill({ icon, size = 'md', iconSize, active = false, className, style, ...props }: IconFillProps) {
  const effectiveIconSize = iconSize ?? size;
  const iconEl = icon ? <Icon name={icon} size={buttonToIconSizeMap[effectiveIconSize]} /> : null;
  const fillClass = active === 'secondary' ? activeSecondaryClass : active ? activeClass : inactiveClass;

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

export function Button({
  variant = 'horizontal',
  size = 'md',
  iconSize,
  active = false,
  href,
  icon,
  className,
  style,
  children,
  ...props
}: ButtonProps) {
  const Tag = (href ? 'a' : 'button') as ElementType;
  const effectiveIconSize = iconSize ?? size;
  const iconEl = icon ? <Icon name={icon} size={buttonToIconSizeMap[effectiveIconSize]} /> : null;
  const fillClass = active === 'secondary' ? activeSecondaryClass : active ? activeClass : inactiveClass;
  const textVariant = textVariantMap[size];

  /* ── iconOnly: the height of the button is still fixed to what it would if it had text ── */
  if (variant === 'iconOnly') {
    return (
      <Tag href={href} {...props}>
        <IconFill icon={icon} size={size} iconSize={iconSize} active={active} className={className} style={style} />
      </Tag>
    );
  }

  const isVertical = variant === 'vertical';

  return (
    <Tag href={href} {...props}>
      <Stack
        direction={isVertical ? 'col' : 'row'}
        gap="md"
        align="center"
        padding="sm"
        className={cn(
          base,
          'w-full',
          fillClass,
          className,
        )}
        style={style}
      >
        {iconEl}
        {children != null && (
          <Text variant={textVariant} as="span" className={cn(!isVertical && 'flex-1 truncate')}>
            {children}
          </Text>
        )}
      </Stack>
    </Tag>
  );
}
