import { useEffect, useState, type ReactNode } from 'react';
import { Rail, Stack, Button, LabelledIconButton, type IconName } from '@primitives';
import { RailHeader } from '@components/RailHeader/RailHeader';
import { cn } from '@lib/cn';
import { getStoredFramePreference, setStoredFramePreference } from '@lib/artboardFrame';

export const LogoPlaceholder = () => (
  <span className="w-6 h-6 rounded-sm bg-accent-default shrink-0" aria-hidden="true" />
);

/**
 * Toggles `data-artboard-frame` on `<html>` (persisted to localStorage),
 * which every Artboard on the page reacts to via `global.css` — no per-
 * instance wiring needed, including for Artboards authored in MDX content.
 */
function FrameToggle() {
  const [frameEnabled, setFrameEnabled] = useState(true);

  useEffect(() => {
    setFrameEnabled(getStoredFramePreference());
  }, []);

  const toggle = () => {
    const next = !frameEnabled;
    setFrameEnabled(next);
    setStoredFramePreference(next);
  };

  const label = frameEnabled ? 'Hide frames' : 'Show frames';

  return (
    <Button
      variant="iconOnly"
      size="lg"
      icon="palette"
      onClick={toggle}
      active={!frameEnabled}
      aria-pressed={!frameEnabled}
      aria-label={label}
      title={label}
    >
      {label}
    </Button>
  );
}

export interface SiteRailFooterItem {
  icon: IconName;
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface SiteRailItem {
  label: string;
  href: string;
  icon?: IconName;
  active?: boolean | 'secondary';
}

export interface SiteRailProps {
  items: SiteRailItem[];
  footerItems?: SiteRailFooterItem[];
  siteName?: string;
  logo?: ReactNode;
  logoHref?: string;
  /** When true, shows labels alongside icons */
  expanded?: boolean;
  className?: string;
}

export function SiteRail({
  items,
  footerItems,
  siteName,
  logo = <LogoPlaceholder />,
  logoHref = '/',
  expanded = false,
  className,
}: SiteRailProps) {
  return (
    <Rail
      width={expanded ? 'w-64' : 'w-14'}
      aria-label="Site navigation"
      className={className}
    >
      <RailHeader
        left={
          <a
            href={logoHref}
            aria-label={siteName ?? 'Home'}
            title={!expanded ? (siteName ?? 'Home') : undefined}
            className="flex items-center justify-center w-full h-full"
          >
            {logo}
          </a>
        }
        title={expanded ? siteName : undefined}
      />
      {expanded
        ? <hr className="border-chrome-border" />
        : <div className="w-8 mx-auto border-b border-chrome-border" />
      }

      <Stack
        as="nav"
        direction="col"
        gap={expanded ? 'sm' : 'lg'}
        align={!expanded ? 'center' : undefined}
        padding='sm'
        className={cn('flex-1', expanded ? 'px-1' : 'px-0')}
      >
        {items.map(({ label, href, icon, active }) => (
          expanded ? (
            <Button
              key={label}
              variant="horizontal"
              size="md"
              icon={icon}
              href={href}
              active={active}
              aria-label={label}
            >
              {label}
            </Button>
          ) : (
            <LabelledIconButton
              key={label}
              direction="vertical"
              size="lg"
              iconSize="lg"
              textVariant="caption"
              icon={icon as IconName}
              href={href}
              active={active}
              aria-label={label}
              title={label}
            >
              {label}
            </LabelledIconButton>
          )
        ))}
      </Stack>

      <Stack
        direction={expanded ? 'row' : 'col'}
        align="center"
        gap="xs"
        justify={expanded ? undefined : 'center'}
        className="p-2 shrink-0 *:grow"
      >
        {footerItems?.map(({ icon, label, href, onClick, active }) => (
          <Button
            key={label}
            variant="iconOnly"
            size="lg"
            icon={icon}
            href={href}
            onClick={onClick}
            active={active}
            aria-label={label}
            title={label}
            className={cn(expanded && 'aspect-auto')}
          >
            {label}
          </Button>
        ))}
        {/* <FrameToggle /> */}
      </Stack>
    </Rail>
  );
}
