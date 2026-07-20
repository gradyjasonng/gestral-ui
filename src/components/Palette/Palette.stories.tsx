import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '@primitives/Icon/Icon';
import { TEXT_SCALE } from '@lib/textScale';
import { RADIUS_SCALE } from '@lib/radiusScale';
import { SPACING_SCALE } from '@lib/spacingScale';

const meta = {
  title: 'Design Tokens/Palette',
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded shrink-0 ${className}`} />
      <span className="font-ui text-xs text-canvas-text-secondary">{name}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <p className="font-display uppercase text-xs text-accent-default mb-4 tracking-widest">{title}</p>
      <div className="flex flex-wrap gap-4">{children}</div>
    </div>
  );
}

const ICON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/**
 * Reference sheet for every design token, grouped by namespace — colors
 * (`chrome.*`, `canvas.*`, `editorial.*`, `accent.*`, `secondary.*`,
 * `input.*`, `selection.*`, `category.work.*`), typography (font families
 * and the full `Text` size/leading scale), radius, spacing, and icon sizes.
 * Not a real usable component — it's a docs-only page (`tags: ['!autodocs']`
 * opts it out of the autodocs tab) for checking token values visually
 * before referencing them in component code. Since component code must
 * never use raw hex values (or ad hoc size/spacing/radius values), this
 * page is the place to look up which token to reach for.
 */
export const Palette: Story = {
  name: 'Palette',
  render: () => (
    <div className="bg-canvas-surface min-h-screen p-12">
      <h1 className="font-display text-2xl uppercase text-canvas-text-primary mb-2">Gestral</h1>
      <p className="font-ui text-sm text-canvas-text-secondary mb-12">Design token palette</p>

      <Section title="Chrome">
        <Swatch name="chrome-surface"          className="bg-chrome-surface border border-chrome-border" />
        <Swatch name="chrome-surface-hover"    className="bg-chrome-surface-hover border border-chrome-border" />
        <Swatch name="chrome-active"           className="bg-chrome-active border border-chrome-border" />
        <Swatch name="chrome-border"           className="bg-chrome-border" />
        <Swatch name="chrome-border-emphasis"  className="bg-chrome-border-emphasis" />
        <Swatch name="chrome-muted"            className="bg-chrome-muted border border-chrome-border" />
        <Swatch name="chrome-muted-hover"      className="bg-chrome-muted-hover border border-chrome-border" />
        <Swatch name="chrome-text-primary"     className="bg-chrome-text-primary" />
        <Swatch name="chrome-text-secondary"   className="bg-chrome-text-secondary" />
        <Swatch name="chrome-text-muted"       className="bg-chrome-text-muted" />
      </Section>

      <Section title="Canvas">
        <Swatch name="canvas-surface"          className="bg-canvas-surface border border-chrome-border" />
        <Swatch name="canvas-muted"            className="bg-canvas-muted border border-chrome-border" />
        <Swatch name="canvas-border"           className="bg-canvas-border" />
        <Swatch name="canvas-text-primary"     className="bg-canvas-text-primary" />
        <Swatch name="canvas-text-secondary"   className="bg-canvas-text-secondary" />
        <Swatch name="canvas-text-muted"       className="bg-canvas-text-muted" />
      </Section>

      <Section title="Editorial">
        <Swatch name="editorial-surface"       className="bg-editorial-surface border border-chrome-border" />
        <Swatch name="editorial-text-primary"  className="bg-editorial-text-primary" />
        <Swatch name="editorial-text-secondary" className="bg-editorial-text-secondary" />
      </Section>

      <Section title="Accent">
        <Swatch name="accent-default"  className="bg-accent-default" />
        <Swatch name="accent-active"   className="bg-accent-active border border-accent-border" />
        <Swatch name="accent-subtle"   className="bg-accent-subtle border border-accent-border" />
        <Swatch name="accent-border"   className="bg-accent-border" />
        <Swatch name="accent-text"     className="bg-accent-text" />
      </Section>

      <Section title="Secondary">
        <Swatch name="secondary-default"  className="bg-secondary-default" />
        <Swatch name="secondary-subtle"   className="bg-secondary-subtle border border-secondary-border" />
        <Swatch name="secondary-border"   className="bg-secondary-border" />
        <Swatch name="secondary-text"     className="bg-secondary-text" />
      </Section>

      <Section title="Input">
        <Swatch name="input-default"  className="bg-input-default" />
        <Swatch name="input-active"   className="bg-input-active border border-input-border" />
        <Swatch name="input-subtle"   className="bg-input-subtle border border-input-border" />
        <Swatch name="input-border"   className="bg-input-border" />
        <Swatch name="input-text"     className="bg-input-text" />
      </Section>

      <Section title="Selection">
        <Swatch name="selection-blue"          className="bg-selection-blue" />
        <Swatch name="selection-purple"        className="bg-selection-purple" />
        <Swatch name="selection-emerald"       className="bg-selection-emerald" />
        <Swatch name="selection-blue-text"     className="bg-selection-blue-text" />
        <Swatch name="selection-purple-text"   className="bg-selection-purple-text" />
        <Swatch name="selection-emerald-text"  className="bg-selection-emerald-text" />
      </Section>

      <Section title="Typography — Font Families">
        <div className="flex flex-col gap-3">
          <span className="font-display text-2xl uppercase text-canvas-text-primary">Display — Kombi</span>
          <span className="font-ui text-base text-canvas-text-primary">UI — Plus Jakarta Sans</span>
          <span className="font-editorial text-base text-editorial-text-primary">Editorial — Lora</span>
        </div>
      </Section>

      <Section title="Typography — Text Scale">
        <div className="flex flex-col gap-4 w-full">
          {Object.entries(TEXT_SCALE).map(([key, entry]) => (
            <div key={key} className="flex items-baseline gap-4 border-b border-chrome-border pb-2">
              <span className="font-ui text-xs text-canvas-text-muted w-40 shrink-0">
                text-{entry.slug}
              </span>
              <span className={`${entry.className} text-canvas-text-primary`} style={{ fontSize: entry.size }}>
                Gestral {key}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radius">
        {Object.values(RADIUS_SCALE).map((entry) => (
          <div key={entry.slug} className="flex items-center gap-3">
            <div
              className="w-16 h-16 bg-chrome-muted border border-chrome-border-emphasis shrink-0"
              style={{ borderRadius: entry.value }}
            />
            <span className="font-ui text-xs text-canvas-text-secondary">
              rounded-{entry.slug} — {entry.value}
            </span>
          </div>
        ))}
      </Section>

      <Section title="Spacing">
        <div className="flex flex-col gap-3 w-full">
          {Object.values(SPACING_SCALE).map((entry) => (
            <div key={entry.slug} className="flex items-center gap-3">
              <span className="font-ui text-xs text-canvas-text-muted w-16 shrink-0">{entry.slug}</span>
              <div className={`h-4 bg-accent-default`} style={{ width: `calc(var(--spacing) * ${entry.multiplier})` }} />
              <span className="font-ui text-xs text-canvas-text-secondary">{entry.comment}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Icon Size">
        {ICON_SIZES.map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Icon name="star" size={size} className="text-canvas-text-primary" />
            <span className="font-ui text-xs text-canvas-text-secondary">icon-size-{size}</span>
          </div>
        ))}
      </Section>
    </div>
  ),
};
