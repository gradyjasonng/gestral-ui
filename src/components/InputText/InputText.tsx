import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@lib/cn';

export type InputTextProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * A single-line text field with the design system's field styling — a thin
 * wrapper over a native `<input>`. Pass `readOnly` for a non-editable
 * display field (e.g. a metadata value the reader can still select and
 * copy), `value`/`onChange` for a controlled field, and any standard input
 * attribute for the rest.
 */
export const InputText = forwardRef<HTMLInputElement, InputTextProps>(function InputText(
  { type = 'text', className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'block w-full min-w-0 rounded-sm border border-chrome-border bg-chrome-surface',
        'px-sp-sm py-sp-xs text-caption font-ui text-chrome-text-primary',
        'placeholder:text-chrome-text-muted',
        'focus-visible:outline-none focus-visible:border-chrome-text-secondary',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...props}
    />
  );
});
