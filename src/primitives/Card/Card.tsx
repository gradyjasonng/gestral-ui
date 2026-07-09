import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@lib/cn';

/** Shadow depth. `flat` sits on the page (border only); `raised` and `floating` add progressively deeper shadows for cards that sit above other content (e.g. a menu or a dragged item). */
export type CardElevation = 'flat' | 'raised' | 'floating';

const elevationClass: Record<CardElevation, string> = {
  flat: '',
  raised: 'shadow-md',
  floating: 'shadow-xl',
};

type CardOwnProps = {
  elevation?: CardElevation;
  children?: ReactNode;
  className?: string;
};

export type CardProps = CardOwnProps &
  (
    | ({ href: string; onClick?: never } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>)
    | ({ href?: undefined; onClick: NonNullable<ButtonHTMLAttributes<HTMLButtonElement>['onClick']> } & Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        'onClick' | 'className' | 'children'
      >)
    | ({ href?: undefined; onClick?: undefined } & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'children'>)
  );

/**
 * The generic bordered surface other card-shaped components (e.g.
 * `PreviewCard`) build on: a `chrome-border`/`chrome-surface` box with an
 * `elevation` shadow.
 *
 * Interactivity is inferred rather than an explicit prop — the same
 * `href`-or-`onClick` pattern `Button` uses — so it can't drift out of sync
 * with whether the card is actually clickable: passing `href` renders an
 * `<a>`, `onClick` a `<button>`, and neither a plain `<div>`. Only the
 * interactive forms get the `selection-blue` hover border and pointer
 * cursor; a plain `<div>` Card is presentational only and shouldn't imply
 * it's clickable.
 */
export function Card({ elevation = 'flat', children, className, ...rest }: CardProps) {
  const interactive = 'href' in rest && rest.href != null ? true : 'onClick' in rest && rest.onClick != null;
  const Tag = ('href' in rest && rest.href != null ? 'a' : 'onClick' in rest && rest.onClick != null ? 'button' : 'div') as ElementType;

  return (
    <Tag
      className={cn(
        'rounded-lg border border-chrome-border bg-chrome-surface',
        elevationClass[elevation],
        interactive && 'cursor-pointer hover:border-selection-blue',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
