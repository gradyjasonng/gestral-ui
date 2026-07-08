import { useEffect, useRef, useState } from 'react';
import { SiteRail, LogoPlaceholder, type SiteRailProps } from '@components/SiteRail/SiteRail';
import { RailHeader } from '@components/RailHeader/RailHeader';
import { Button } from '@primitives';
import { cn } from '@lib/cn';

export interface MobileNavProps extends Omit<SiteRailProps, 'expanded' | 'className'> {
  className?: string;
}

/**
 * Small-screen navigation for the Shell: a slim top bar (menu button, logo,
 * site name) that opens the SiteRail as a slide-in overlay drawer. Hidden at
 * `md` and up, where the Shell's rails take over. Place it in the Shell's
 * `overline` slot.
 */
export function MobileNav({ className, ...railProps }: MobileNavProps) {
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
              // Navigating from the drawer should also dismiss it.
              if ((event.target as HTMLElement).closest('a')) setOpen(false);
            }}
          >
            <SiteRail expanded {...railProps} className="h-full shadow-xl" />
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
