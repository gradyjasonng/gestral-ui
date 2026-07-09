# Gestral Design System v2

## 1. Concept

Gestral's visual language is a **deconstructed design tool UI**. The reference point is Figma — specifically Figma Web, which has no top toolbar and instead puts everything into a left rail. Gestral is not a skin of Figma; it borrows Figma's structural vocabulary and scatters those motifs deliberately through an otherwise original layout.

The result should feel like: *a personal site built by someone who lives in design tools — and can't quite help it showing.*

---

## 2. Layout Structure

The global shell has two regions.

### Left rail (always present)

- **Top:** site header block — site title with a small emerald dot, parent breadcrumb context above it when navigating deeper than Home
- **Middle:** panel sections — "Pages" on Home/section views, "Layers" on individual post/case study views (the panel label changes; the tree becomes the article ToC)
- **Bottom:** icon rail — GitHub, LinkedIn, theme toggle, search

### Canvas (everything else)

- Pure white background (stone-900 in dark mode)
- Content regions are introduced with a **frame label**: a small uppercase tag with an emerald square-outline prefix, like Figma's artboard labels
- On post pages, embedded Figma iframes are wrapped in a styled artboard container (emerald border, frame label floating above)

There is no persistent right panel. No top toolbar. Navigation, context, and ToC all live in the left rail.

### Rail pairing convention

- **Canvas + CanvasRail** (collapsed SiteRail) — post/case-study pages. Deconstructed, artboard-heavy: embedded content wrapped in `Artboard`, pannable/zoomable `Canvas`.
- **Page** (expanded SiteRail, no CanvasRail) — top-level index pages (Home/Blog/Work): hero title and a `PreviewCard` grid on a plain content surface.

`CanvasRail`'s panel section labels ("Layers", "Info") are presentation copy only — they don't imply a `Page` component is present.

---

## 3. Navigation Behaviour

| Context | Header title | Crumb above | Panel label | Panel content |
|---------|-------------|-------------|-------------|---------------|
| Home | "grady.ng" | — | Pages | Home / Blog / Work |
| Blog or Work | "Blog" / "Work" | Home | Pages | Home / Blog / Work |
| Post / case study | Post title (truncated) | Home › Blog or Home › Work | Layers | Article ToC |

---

## 4. Typography

Three typefaces, three semantic roles — never mixed within the same element.

| Token | Face | Role | Usage |
|-------|------|------|-------|
| `font.display` | **Kombi** (custom, uppercase only) | Display | Major headings, frame labels, site header title |
| `font.ui` | **Plus Jakarta Sans** | UI / Chrome | Nav labels, card metadata, body copy, captions |
| `font.editorial` | **Lora** | Editorial | Longform prose inside posts and case studies only |

Type scale follows Tailwind v4's fluid scale. No bespoke sizes outside the scale.

### Kombi font-face declaration

Kombi is a local font asset. The files live at `src/fonts/Kombi-Regular.{woff2,woff,otf}`. The `@font-face` declaration in `src/styles/global.css`:

```css
@font-face {
  font-family: 'Kombi';
  src: url('../fonts/Kombi-Regular.woff2') format('woff2'),
       url('../fonts/Kombi-Regular.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

The `font-display` token resolves to `Kombi` with `system-ui` as the system fallback. The `font-ui` token resolves to `Plus Jakarta Sans` with `system-ui` fallback. The `font-editorial` token resolves to `Lora` with `Georgia` fallback.

---

## 5. Colour

### Accent

Tailwind emerald palette. Primary interactive states use `emerald-500` on light surfaces, `emerald-400` on dark surfaces.

### Surfaces — light mode

| Role | Value |
|------|-------|
| Canvas | `white` (#ffffff) |
| Rail / chrome | `stone-50` (#fafaf9 — warm off-white, not grey) |
| Hairline borders | `stone-200` |
| Emphasis borders | `stone-300` |

### Surfaces — dark mode

| Role | Value |
|------|-------|
| Canvas | `stone-900` |
| Rail / chrome | `stone-950` |
| Hairline borders | `stone-800` |
| Emphasis borders | `stone-700` |

### Categorical colours

| Category | Light | Dark |
|----------|-------|------|
| Blog content | emerald family | emerald family (shifted) |
| Work/case study content | `violet-500` | `violet-400` |
| General UI | stone neutrals | stone neutrals |

No purple that visually references Figma's brand. Violet is distinct enough and used only for the Work category, not for interactive states.

### Mode

System preference by default. Manual toggle available via the icon rail. Both modes are fully specified — no partial dark mode support.

---

## 6. Figma Motifs

These specific Figma UI elements appear as design motifs. Use them where they earn their place; don't force them everywhere.

| Motif | Usage in Gestral |
|-------|-----------------|
| **Layer/node tree** | Left rail panel — most direct structural reference |
| **Frame labels** | Small uppercase tag with square-outline prefix, floated above content sections. Kombi typeface. |
| **Artboard containers** | On post pages, wrapping embedded Figma iframes. Emerald border, frame label outside-top-left. |
| **Panel section labels** | "Pages" / "Layers" — muted, uppercase, small, above the node tree |
| **Icon rail** | Bottom of left panel. Compressed version of Figma's left icon strip. |
| **PreviewCard thumbnails** | Cards on the home grid carry a layer name in small text above the thumbnail image |

**Motifs intentionally not used:** toolbar, properties inspector (right panel), comment bubbles, cursor presence, component badges.

---

## 7. Motion

Transitions should be used **extremely sparingly**. Gestral should feel snappy, like a design tool — state changes (hover, focus, selection) register instantly. Default to no transition at all; states just change.

Do not add `transition-*` utilities as a default habit on interactive elements. If a transition is genuinely warranted, justify it against this principle first.

---

## 8. Token Naming Philosophy

Tokens are organised in three semantic zones that map directly to the layout:

| Zone | Scope |
|------|-------|
| `chrome.*` | Left rail, borders, panel surfaces |
| `canvas.*` | Page content area, prose surfaces |
| `editorial.*` | Longform prose (Lora), post body |

Each zone has its own surface, text, and border tokens, resolved from shared Tailwind primitives. Light and dark mode are separate token sets, not overrides — both are fully specified.

Primitive naming follows W3C DTCG format (`$value`, `$type`, `$description`). Semantic tokens reference Tailwind primitives via `com.figma.aliasData.targetVariableName`.

**No token references a visual metaphor from v1** (mat, paper, marking, graphite, ink, stencil). These are fully removed.

---

## 9. Token Reference

### Semantic tokens — light mode

| Token | CSS property | Value |
|-------|-------------|-------|
| `color.chrome.surface` | `--color-chrome-surface` | stone-50 |
| `color.chrome.border` | `--color-chrome-border` | stone-200 |
| `color.chrome.borderEmphasis` | `--color-chrome-border-emphasis` | stone-300 |
| `color.chrome.text.primary` | `--color-chrome-text-primary` | stone-900 |
| `color.chrome.text.secondary` | `--color-chrome-text-secondary` | stone-500 |
| `color.chrome.text.muted` | `--color-chrome-text-muted` | stone-400 |
| `color.canvas.surface` | `--color-canvas-surface` | white |
| `color.canvas.border` | `--color-canvas-border` | stone-200 |
| `color.canvas.text.primary` | `--color-canvas-text-primary` | stone-900 |
| `color.canvas.text.secondary` | `--color-canvas-text-secondary` | stone-600 |
| `color.editorial.surface` | `--color-editorial-surface` | white |
| `color.editorial.text.primary` | `--color-editorial-text-primary` | stone-800 |
| `color.editorial.text.secondary` | `--color-editorial-text-secondary` | stone-500 |
| `color.accent.default` | `--color-accent-default` | emerald-500 |
| `color.accent.subtle` | `--color-accent-subtle` | emerald-50 |
| `color.accent.border` | `--color-accent-border` | emerald-200 |
| `color.accent.text` | `--color-accent-text` | emerald-700 |
| `color.category.work.default` | `--color-category-work-default` | violet-500 |
| `color.category.work.subtle` | `--color-category-work-subtle` | violet-50 |
| `color.category.work.border` | `--color-category-work-border` | violet-200 |
| `color.category.work.text` | `--color-category-work-text` | violet-700 |

Dark mode mirrors the same token names with inverted surface values (stone-900/950) and shifted accent values (emerald-400/violet-400).

### Typography tokens

| Token | CSS property | Value |
|-------|-------------|-------|
| `font.display` | `--font-display` | Kombi |
| `font.ui` | `--font-ui` | Plus Jakarta Sans |
| `font.editorial` | `--font-editorial` | Lora |

### Radius tokens

| Token | CSS property | Value |
|-------|-------------|-------|
| `radius.sm` | `--radius-sm` | 4px |
| `radius.md` | `--radius-md` | 6px |
| `radius.lg` | `--radius-lg` | 8px |
| `radius.pill` | `--radius-pill` | 9999px |
