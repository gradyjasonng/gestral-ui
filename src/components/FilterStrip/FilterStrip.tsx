import { cn } from '../../lib/cn';
import { Chip } from '../../primitives/Chip/Chip';
import { Stack } from '../../primitives/Stack/Stack';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterStripProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterStrip({ options, value, onChange, className }: FilterStripProps) {
  return (
    <Stack direction="row" gap="md" align="center" className={className} role="group">
      {options.map((option) => (
        <Chip
          key={option.value}
          active={option.value === value}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Chip>
      ))}
    </Stack>
  );
}
