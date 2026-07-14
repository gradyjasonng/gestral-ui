import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@lib/cn';

/** Shadow depth. `flat` sits on the page (border only); `raised` and `floating` add progressively deeper shadows for cards that sit above other content (e.g. a menu or a dragged item). */
export type CardElevation = 'flat' | 'raised' | 'floating';

/** Token set for the border/background. `chrome` (default) is app UI; `editorial` is long-form article content (matches `Prose`/`Artboard` editorial theming). */
export type CardSurface = 'chrome' | 'editorial';

const elevationClass: Record<CardElevation, string> = {
  flat: '',
  raised: 'shadow-md',
  floating: 'shadow-xl',
};

const surfaceClass: Record<CardSurface, string> = {
  chrome: 'border-chrome-border bg-chrome-surface',
  editorial: 'border-canvas-border bg-editorial-surface',
};

type CardOwnProps = {
  elevation?: CardElevation;
  surface?: CardSurface;
  children?: ReactNode;
  className?: string;
  /** Root element tag when neither `href` nor `onClick` is set (e.g. `as="li"` for a Card that's an item in a `Stack as="ul"`). Ignored for the interactive `href`/`onClick` forms, which always render `a`/`button`. */
  as?: ElementType;
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
 * it's clickable. A non-interactive Card can still override its tag via
 * `as` (e.g. `as="li"` for a Card that's an item in a `Stack as="ul"`).
 */
export function Card({ elevation = 'flat', surface = 'chrome', as = 'div', children, className, ...rest }: CardProps) {
  const interactive = 'href' in rest && rest.href != null ? true : 'onClick' in rest && rest.onClick != null;
  const Tag = ('href' in rest && rest.href != null ? 'a' : 'onClick' in rest && rest.onClick != null ? 'button' : as) as ElementType;

  return (
    <Tag
      className={cn(
        'rounded-lg border outline-2 -outline-offset-1 outline-transparent',
        surfaceClass[surface],
        elevationClass[elevation],
        interactive && 'cursor-pointer hover:outline-selection-blue focus:outline-selection-blue',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
