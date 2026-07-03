import type { ReactNode } from 'react';
import { Rail } from '../../primitives/Rail/Rail';
import { Stack } from '../../primitives/Stack/Stack';
import { RailHeader } from '../RailHeader/RailHeader';
import { Button } from '../../primitives/Button/Button';
import { LabelledIconButton } from '../../primitives/Button/LabelledIconButton';
import type { IconName } from '../../primitives/Icon/Icon';
import { cn } from '../../lib/cn';

const LogoPlaceholder = () => (
  <span className="w-6 h-6 rounded-sm bg-accent-default shrink-0" aria-hidden="true" />
);

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
      width={expanded ? 'w-48' : 'w-14'}
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

      {footerItems && footerItems.length > 0 && (
        <Stack
          direction={expanded ? 'row' : 'col'}
          align="center"
          gap="sm"
          justify={expanded ? 'around' : 'center'}
          className="py-2 shrink-0"
        >
          {footerItems.map(({ icon, label, href, onClick, active }) => (
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
            >
              {label}
            </Button>
          ))}
        </Stack>
      )}
    </Rail>
  );
}
