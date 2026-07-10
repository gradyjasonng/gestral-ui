import { useRef, useState } from 'react';
import { cn } from '@lib/cn';
import { Button, type ButtonSize, type ButtonPalette, type IconName, Stack } from '@primitives';

export type SegmentedControlPalette = ButtonPalette;

export interface SegmentedControlOption {
  label: string;
  value: string;
  icon?: IconName;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  /** Controlled selection. Omit to let SegmentedControl manage its own state. */
  value?: string;
  /** Initial selection when uncontrolled. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Color scheme applied to the selected option. Defaults to `input`, the standard palette for form/interactive controls. */
  palette?: SegmentedControlPalette;
  size?: ButtonSize;
  /** Rendered as `data-name`, letting non-React listeners scope a `gui-change` CustomEvent to this instance. */
  name?: string;
  /** Renders each option as an icon-only button — the label becomes the accessible name (`aria-label`/`title`) instead of visible text. Every option must have an `icon` when this is set. */
  iconOnly?: boolean;
  className?: string;
}

export function SegmentedControl({
  options,
  value,
  defaultValue,
  onChange,
  palette = 'input',
  size = 'md',
  name,
  iconOnly = false,
  className,
}: SegmentedControlProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = value ?? internalValue;

  function select(next: string) {
    if (value === undefined) {
      setInternalValue(next);
    }
    onChange?.(next);
    rootRef.current?.dispatchEvent(
      new CustomEvent('gui-change', { detail: { value: next, name }, bubbles: true }),
    );
  }

  return (
    <div
      ref={rootRef}
      data-segmented-control
      data-name={name}
      className={cn('inline-flex p-1 rounded-lg bg-chrome-muted', className)}
    >
      <Stack direction="row" gap="sm" className="flex-wrap">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={iconOnly ? 'iconOnly' : undefined}
            size={size}
            active={current === option.value}
            aria-pressed={current === option.value}
            palette={palette}
            surface="muted"
            icon={option.icon}
            className="justify-center"
            onClick={() => select(option.value)}
            aria-label={iconOnly ? option.label : undefined}
            title={iconOnly ? option.label : undefined}
          >
            {iconOnly ? undefined : option.label}
          </Button>
        ))}
      </Stack>
    </div>
  );
}
