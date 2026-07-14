import type { ReactNode } from 'react';
import { Rail, Stack, Button, LabelledIconButton, Text, type IconName } from '@primitives';
import { RailHeader } from '@components/RailHeader/RailHeader';
import { ButtonWithPreviewCard } from '@components/ButtonWithPreviewCard/ButtonWithPreviewCard';
import { cn } from '@lib/cn';

export const LogoPlaceholder = () => (
  <span className="w-6 h-6 rounded-sm bg-accent-default shrink-0" aria-hidden="true" />
);

export interface SiteRailItem {
  label: string;
  href: string;
  icon?: IconName;
  active?: boolean | 'secondary';
}

export interface SiteRailExternalLink {
  label: string;
  href: string;
  icon?: IconName;
  /** Site-specific icon rendered in the compact (hover-capable) link — see `Button`'s `customIcon`. */
  customIcon?: ReactNode;
  /**
    Optional rich preview shown on hover next to the compact link (e.g. a
    `PreviewCard`). On touch devices — which can't hover — this is rendered
    directly as the link instead of the compact icon+label. Links with no
    `preview` (e.g. a plain GitHub/LinkedIn link) just render the compact
    icon+label everywhere, with no hover reveal.
  */
  preview?: ReactNode;
}

export interface SiteRailProps {
  items: SiteRailItem[];
  /**
    A secondary set of links — individual pages, external sites, or social
    profiles — rendered after a divider, below `items`. Each renders as a
    compact icon+label `Button`; if it has a `preview`, that's revealed on
    hover, with the preview itself rendered directly as the link on touch
    devices (no hover). Unlike `items`, this section renders even when the
    rail is collapsed.
  */
  externalLinks?: SiteRailExternalLink[];
  /** Gray `labelSm` heading rendered just below the divider, above `externalLinks`. Only shown when the rail is `expanded`. */
  externalLinksLabel?: string;
  siteName?: string;
  logo?: ReactNode;
  logoHref?: string;
  /** When true, shows labels alongside icons */
  expanded?: boolean;
  className?: string;
}

export function SiteRail({
  items,
  externalLinks,
  externalLinksLabel,
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
        gap={expanded ? 'xs' : 'lg'}
        align={!expanded ? 'center' : undefined}
        padding={expanded ? 'xs' : 'md'}
        className={'flex-1'}
      >
        {items.map(({ label, href, icon, active }) => (
          expanded ? (
            <Button
              key={label}
              variant="horizontal"
              size="xl"
              iconSize="md"
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
              iconSize="md"
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

      {externalLinks && externalLinks.length > 0 && (
        <>
          {expanded
            ? <hr className="border-chrome-border" />
            : <div className="w-8 mx-auto border-b border-chrome-border" />
          }
          <Stack
            direction="col"
            gap="sm"
            align={!expanded ? 'center' : undefined}
            padding={expanded ? 'xs' : 'lg'}
            className={cn('shrink-0')}
          >
            {expanded && externalLinksLabel && (
              <Text variant="labelXSmall" className="text-chrome-text-muted p-sp-xs">
                {externalLinksLabel}
              </Text>
            )}
            {externalLinks.map(({ label, href, icon, customIcon, preview }) => (
              preview ? (
                <ButtonWithPreviewCard
                  key={label}
                  label={label}
                  href={href}
                  icon={icon}
                  customIcon={customIcon}
                  previewCard={preview}
                  expanded={expanded}
                />
              ) : expanded ? (
                <Button key={label} variant="horizontal" size="xl" iconSize="md" icon={icon} customIcon={customIcon} href={href} aria-label={label}>
                  {label}
                </Button>
              ) : (
                <Button key={label} variant="iconOnly" size="lg" iconSize="md" icon={icon} customIcon={customIcon} href={href} aria-label={label} title={label} />
              )
            ))}
          </Stack>
        </>
      )}
    </Rail>
  );
}
