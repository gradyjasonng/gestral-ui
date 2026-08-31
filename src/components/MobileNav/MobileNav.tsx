import { useEffect, useRef, useState, type ReactNode } from 'react';
import { SiteRail, LogoPlaceholder, type SiteRailProps } from '@components/SiteRail/SiteRail';
import { RailHeader } from '@components/RailHeader/RailHeader';
import { Button } from '@components/Button/Button';
import { cn } from '@lib/cn';

export interface MobileNavProps extends Omit<SiteRailProps, 'expanded' | 'className'> {
  className?: string;
  /**
   * Extra rail content shown alongside the (collapsed) SiteRail in the
   * drawer — typically a CanvasRail composition, so the drawer mirrors the
   * desktop Shell's own collapsed-SiteRail-plus-CanvasRail column instead of
   * just the site-wide nav. Omit it (e.g. on the home page, which has
   * nothing analogous to show here) for a SiteRail-only drawer.
   */
  secondaryRail?: ReactNode;
}

/**
 * Small-screen navigation for the Shell: a slim top bar (menu button, logo,
 * site name) that opens the SiteRail — collapsed, same as the desktop
 * Shell's, so it sits narrow alongside `secondaryRail` rather than crowding
 * it out — plus `secondaryRail` itself, if given, as a slide-in overlay
 * drawer. Hidden at `md` and up, where the Shell's rails take over. Place it
 * in the Shell's `overline` slot.
 */
export function MobileNav({ className, secondaryRail, ...railProps }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const { siteName, logo = <LogoPlaceholder />, logoHref = '/' } = railProps;

  return (
    <div className={cn('md:hidden', className)}>
      <div className="flex items-stretch bg-chrome-surface border-b border-chrome-border">
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
          className="flex-1 min-w-0"
        />
        <div className="flex items-center pr-2">
          <Button
            variant="iconOnly"
            size="sm"
            icon="menu"
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          tabIndex={-1}
          className="fixed inset-0 z-50 outline-none"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute inset-y-0 left-0 flex items-start gap-2"
            onClick={(event) => {
              // Navigating from the drawer should also dismiss it — but not
              // when the link's own onClick (see SiteRailItem.onClick)
              // already called preventDefault() to intercept the click
              // instead of navigating (e.g. to swap secondaryRail's content
              // in place first). That handler runs before this one (it's on
              // the descendant <a>, and this fires on bubble), so
              // defaultPrevented already reflects its decision by here.
              if (!event.defaultPrevented && (event.target as HTMLElement).closest('a')) setOpen(false);
            }}
          >
            <div className="flex h-full shadow-xl">
              <SiteRail {...railProps} className="h-full" />
              {secondaryRail}
            </div>
            <Button
              variant="iconOnly"
              size="sm"
              iconSize="lg"
              icon="x"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="fixed top-3 right-2 bg-chrome-surface"
            />
          </div>
        </div>
      )}
    </div>
  );
}
