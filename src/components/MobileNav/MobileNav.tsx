import { useEffect, useRef, useState, type MouseEvent, type MouseEventHandler, type ReactNode } from 'react';
import { Stack, type IconName } from '@primitives';
import { LogoPlaceholder, type SiteRailItem } from '@components/SiteRail/SiteRail';
import { RailHeader } from '@components/RailHeader/RailHeader';
import { Button } from '@components/Button/Button';
import { LabelledIconButton } from '@components/Button/LabelledIconButton';
import { cn } from '@lib/cn';

export interface MobileNavProps {
  /**
   * Top-level nav entries, rendered as a row of icon+label buttons in the
   * bar. An entry whose `onClick` calls `preventDefault()` opens the drawer
   * (showing `secondaryRail`) instead of navigating; every other entry is a
   * plain link. Omit the entry the logo already stands in for (Home).
   */
  items: SiteRailItem[];
  siteName?: string;
  logo?: ReactNode;
  logoHref?: string;
  /**
   * Section name shown under `siteName` in the bar (e.g. "Blog") — mirrors
   * `CanvasRail`'s subtitle. Omit where there's no section, e.g. Home.
   */
  subtitle?: string;
  /**
   * The section rail revealed in a right-aligned modal drawer when a
   * drawer-opening nav item (one whose `onClick` calls `preventDefault()`)
   * is tapped — typically a scrollable stack of the current section's page
   * cards. The caller swaps this in response to which item was tapped;
   * MobileNav only shows and hides the drawer. MobileNav floats the nav
   * buttons over its top-right and a close button over its bottom-right, so
   * give `secondaryRail` matching top/bottom padding to clear them.
   */
  secondaryRail?: ReactNode;
  /**
   * Called whenever the drawer is dismissed *without* a page having been
   * chosen from it — the scrim, the close button, Escape, or tapping the
   * open section's own nav button again. Use it to roll any "previewing
   * this section" state back to what the current page implies, so a nav
   * button left highlighted by an abandoned preview resets.
   */
  onClose?: () => void;
  className?: string;
}

/**
 * Small-screen navigation for the Shell: a slim top bar — `fixed` to the
 * viewport top so it stays put as the page scrolls (an in-flow spacer keeps
 * its height reserved) — with the logo (a Home link), the site name plus
 * optional section `subtitle`, and `items` as a row of icon+label buttons.
 * Tapping an item that intercepts its own click (via
 * `preventDefault()`) slides `secondaryRail` in from the right as a modal
 * drawer — the section's page cards — with the same nav buttons poking
 * through onto the sheet and a close button at the bottom-right. Tapping
 * that same item again, Escape, the scrim, or the close button dismisses it
 * (and fires `onClose`). Hidden at `md` and up, where the Shell's rails
 * take over. Place it in the Shell's `overline` slot.
 */
export function MobileNav({
  items,
  siteName,
  logo = <LogoPlaceholder />,
  logoHref = '/',
  subtitle,
  secondaryRail,
  onClose,
  className,
}: MobileNavProps) {
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const open = openLabel !== null;

  const close = () => {
    setOpenLabel(null);
    onClose?.();
  };

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleItemClick = (
    event: MouseEvent<HTMLElement>,
    label: string,
    onClick?: MouseEventHandler<HTMLElement>,
  ) => {
    onClick?.(event);
    // Only an item that intercepted its own navigation drives the drawer; a
    // plain link just follows its href.
    if (!event.defaultPrevented) return;
    // Tapping the section that's already showing dismisses it (and resets,
    // via close → onClose); tapping another swaps the drawer's content.
    if (openLabel === label) close();
    else setOpenLabel(label);
  };

  const navButtons = () =>
    items.map(({ label, href, icon, active, onClick }) => (
      <LabelledIconButton
        key={label}
        direction="horizontal"
        size="sm"
        iconSize="md"
        textVariant="caption"
        icon={icon as IconName}
        href={href}
        active={active}
        aria-current={active ? 'page' : undefined}
        aria-expanded={onClick ? openLabel === label : undefined}
        title={label}
        onClick={(event: MouseEvent<HTMLElement>) => handleItemClick(event, label, onClick)}
      >
        {label}
      </LabelledIconButton>
    ));

  return (
    <div className={cn('md:hidden', className)}>
      <div className="fixed inset-x-0 top-0 z-40 flex items-stretch bg-chrome-surface border-b border-chrome-border">
        <RailHeader
          left={
            <a
              href={logoHref}
              aria-label={siteName ?? 'Home'}
              className="flex items-center justify-center w-full h-full"
            >
              {logo}
            </a>
          }
          title={siteName}
          subtitle={subtitle}
          className="flex-1 min-w-0"
        />
        <Stack as="nav" direction="row" align="center" gap="sm" className="pr-3 shrink-0">
          {navButtons()}
        </Stack>
      </div>
      {/* The bar is fixed; this reserves its height in normal flow so the
          page content below starts under it, not behind it. */}
      <div className="h-14 shrink-0" aria-hidden="true" />

      {open && secondaryRail && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Section navigation"
          tabIndex={-1}
          className="fixed inset-0 z-50 outline-none"
        >
          <div className="absolute inset-0 bg-black/40" onClick={close} aria-hidden="true" />
          <div
            className="absolute inset-y-0 right-0 flex"
            onClick={(event) => {
              // A link tap inside the drawer that actually navigates (didn't
              // preventDefault to swap the rail's content in place) also
              // dismisses the drawer.
              if (!event.defaultPrevented && (event.target as HTMLElement).closest('a')) close();
            }}
          >
            <div className="relative flex h-full shadow-xl">
              {secondaryRail}
              <Stack
                as="nav"
                direction="row"
                align="center"
                justify="end"
                gap="sm"
                className="absolute inset-x-0 top-0 h-14 pl-4 pr-3"
              >
                {navButtons()}
              </Stack>
              <Button
                variant="iconOnly"
                size="sm"
                iconSize="lg"
                icon="x"
                aria-label="Close navigation"
                onClick={close}
                className="absolute bottom-3 right-3 bg-chrome-surface shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
