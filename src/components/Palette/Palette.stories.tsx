import type { Meta, StoryObj } from '@storybook/react-vite';

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

/**
 * Reference sheet for every semantic design token, grouped by namespace
 * (`chrome.*`, `canvas.*`, `editorial.*`, `accent.*`, `secondary.*`,
 * `input.*`, `category.work.*`) plus the three font families. Not a real
 * usable component — it's a docs-only
 * page (`tags: ['!autodocs']` opts it out of the autodocs tab) for checking
 * token values visually before referencing them in component code. Since
 * component code must never use raw hex values, this page is the place to
 * look up which semantic token to reach for.
 */
export const Palette: Story = {
  name: 'Palette',
  render: () => (
    <div className="bg-canvas-surface min-h-screen p-12">
      <h1 className="font-display text-2xl uppercase text-canvas-text-primary mb-2">Gestral</h1>
      <p className="font-ui text-sm text-canvas-text-secondary mb-12">Design token palette</p>

      <Section title="Chrome">
        <Swatch name="chrome-surface"          className="bg-chrome-surface border border-chrome-border" />
        <Swatch name="chrome-border"           className="bg-chrome-border" />
        <Swatch name="chrome-border-emphasis"  className="bg-chrome-border-emphasis" />
        <Swatch name="chrome-text-primary"     className="bg-chrome-text-primary" />
        <Swatch name="chrome-text-secondary"   className="bg-chrome-text-secondary" />
        <Swatch name="chrome-text-muted"       className="bg-chrome-text-muted" />
      </Section>

      <Section title="Canvas">
        <Swatch name="canvas-surface"          className="bg-canvas-surface border border-chrome-border" />
        <Swatch name="canvas-border"           className="bg-canvas-border" />
        <Swatch name="canvas-text-primary"     className="bg-canvas-text-primary" />
        <Swatch name="canvas-text-secondary"   className="bg-canvas-text-secondary" />
      </Section>

      <Section title="Editorial">
        <Swatch name="editorial-surface"       className="bg-editorial-surface border border-chrome-border" />
        <Swatch name="editorial-text-primary"  className="bg-editorial-text-primary" />
        <Swatch name="editorial-text-secondary" className="bg-editorial-text-secondary" />
      </Section>

      <Section title="Accent">
        <Swatch name="accent-default"  className="bg-accent-default" />
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

      <Section title="Typography">
        <div className="flex flex-col gap-3">
          <span className="font-display text-2xl uppercase text-canvas-text-primary">Display — Kombi</span>
          <span className="font-ui text-base text-canvas-text-primary">UI — Plus Jakarta Sans</span>
          <span className="font-editorial text-base text-editorial-text-primary">Editorial — Lora</span>
        </div>
      </Section>
    </div>
  ),
};
