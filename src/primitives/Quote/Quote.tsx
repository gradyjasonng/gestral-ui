import type { ReactNode } from 'react';
import { cn } from '@lib/cn';
import { Icon, type IconName } from '@primitives/Icon/Icon';
import { Text, type TextVariant } from '@primitives/Text/Text';

export interface QuoteProps {
  children: ReactNode;
  /** Icon shown beside the quote, identifying who said it. Defaults to a generic person, e.g. a research participant. */
  icon?: IconName;
  variant?: TextVariant;
  className?: string;
  /** className applied to the quote text itself, e.g. to set a color that matches the surrounding surface (editorial vs chrome). */
  textClassName?: string;
}

/**
 * A short attributed quote with a leading icon — e.g. a research participant's
 * verbatim in a findings write-up. Renders the quote as a `<q>` by default.
 */
export function Quote({ children, icon = 'user', variant = 'bodySmall', className, textClassName }: QuoteProps) {
  return (
    <div className={cn('flex items-center gap-sp-md', className)}>
      <Icon name={icon} className="inline shrink-0" />
      <Text as="q" variant={variant} className={textClassName}>
        {children}
      </Text>
    </div>
  );
}
