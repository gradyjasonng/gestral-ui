import { type ElementType, type ReactNode } from 'react';
import { cn } from '@lib/cn';
import { Stack } from '@primitives/Stack/Stack';
import { Text, type TextVariant } from '@primitives/Text/Text';
import { type IconName } from '@primitives/Icon/Icon';
import { IconFill, type ButtonProps } from './Button';
import {
  textVariantMap,
  activeFillClass,
  activeSecondaryClass,
  paletteTextClass,
} from './shared';

export type LabelledIconButtonDirection = 'horizontal' | 'vertical';

export interface LabelledIconButtonProps extends Omit<ButtonProps, 'variant' | 'icon' | 'children'> {
  icon: IconName;
  /** Label text, rendered outside the icon fill. */
  children: ReactNode;
  /** Overrides the size-derived label Text variant. */
  textVariant?: TextVariant;
  /** Icon beside the label, or icon above the label. */
  direction?: LabelledIconButtonDirection;
}

/**
 * Fill covers only the icon; the label sits outside it. Hover is triggered by
 * the group container, not the icon fill itself, so the whole component reads
 * as one clickable unit.
 */
export function LabelledIconButton({
  size = 'md',
  iconSize,
  active = false,
  palette = 'accent',
  href,
  icon,
  textVariant,
  direction = 'vertical',
  className,
  style,
  children,
  ...props
}: LabelledIconButtonProps) {
  const Tag = (href ? 'a' : 'button') as ElementType;
  const effectiveIconSize = iconSize ?? size;
  const isVertical = direction === 'vertical';

  const fillClass = active === 'secondary'
    ? activeSecondaryClass(palette)
    : active
      ? activeFillClass(palette, 'default')
      : 'text-chrome-text-secondary group-hover:bg-chrome-surface-hover group-hover:text-chrome-text-primary';

  const labelColorClass = active
    ? paletteTextClass[palette]
    : 'text-chrome-text-secondary group-hover:text-chrome-text-primary';

  return (
    <Tag href={href} {...props}>
      <Stack
        direction={isVertical ? 'col' : 'row'}
        gap="xs"
        align="center"
        className={cn('group cursor-pointer select-none', className)}
        style={style}
      >
        <IconFill
          icon={icon}
          size={size}
          iconSize={effectiveIconSize}
          active={active}
          palette={palette}
          aria-hidden="true"
          className={cn('rounded-sm', fillClass)}
        />
        <Text variant={textVariant ?? textVariantMap[size]} as="span" className={labelColorClass}>
          {children}
        </Text>
      </Stack>
    </Tag>
  );
}
