# Gestral UI

## Design Philosophy

See `DESIGN.md` for the canonical v2 design philosophy.

The short version: Gestral's visual language is a **deconstructed design tool UI**, borrowing structural vocabulary from Figma (left rail, frame labels, node tree, artboard containers) without mimicking it directly. The result should feel like a personal site built by someone who lives in design tools.

---

## Architecture

- **Vite** library mode, **Tailwind v4**, **Storybook** Connect
- `tokens.css`'s `:root` token *values* (colors, fonts, icon-size) are hand-authored; its `@theme inline { ... }` Tailwind-registration block is **fully generated** (nothing hand-maintained there, for any token family) into a single gitignored `src/styles/generated.css` (imported by `tokens.css`), via `vite.config.ts`'s `generate-tokens-css` plugin. The text-size, radius, and spacing-inline/stack scale *values* are also generated, from `src/lib/{textScale,radiusScale,spacingScale}.ts` — those are the source of truth for that scale (including `Text.tsx`'s HTML element/font classes and the `@source` safelist Tailwind needs since `Text.tsx` builds its class via template literal). Edit `tokens.css`'s `:root` values or the TS modules — never `generated.css` directly.
- `dist/theme.css` (generated from `tokens.css` at build time) is the consumable stylesheet for downstream apps (exported as `./theme`)
- Components live in `src/components/`, each with a `.tsx` and a `.stories.tsx`
- No hex values in component code — all colours reference semantic tokens (`chrome.*`, `canvas.*`, `editorial.*`, `accent.*`, `category.work.*`)

### The `./styles` export (`dist/index.css`) does not ship stock Tailwind utilities

`src/styles/tokens.css` and `src/styles/global.css` both import Tailwind with
`@import "tailwindcss" source(none);` — this stops the library's own build
from scanning `src/**/*.tsx` and baking a duplicate copy of stock utilities
(`flex`, `px-4`, `gap-4`, ...) into `dist/index.css`. That duplicate copy used
to collide with a consumer's own Tailwind output: both rules have identical
specificity, so whichever CSS layer contribution happened to land later in
source order won — and an unconditioned utility from gestral-ui's bundle
could silently outrank a consumer's `sm:`-prefixed responsive variant.

Consequences:
- **Consumers must add `tailwindcss` themselves** (declared as a
  `peerDependency`) and point a Tailwind `@source` directive at
  `node_modules/@gradyjasonng/gestral-ui/dist` so their own build generates
  whatever stock utility classes gestral-ui's components actually use.
  Example, in the consumer's global CSS:
  ```css
  @import 'tailwindcss';
  @source '../../node_modules/@gradyjasonng/gestral-ui/dist';
  @import '@gradyjasonng/gestral-ui/styles';
  @import '@gradyjasonng/gestral-ui/theme';
  ```
  That path must stay a real filesystem path, not the bare package name —
  `@source` resolves as a literal glob, not npm module resolution, so
  `@source '@gradyjasonng/gestral-ui'` silently matches nothing. It also
  must point at `dist/` specifically, not the package root: our own
  `.gitignore` excludes `dist/`, and Tailwind's directory-walk respects
  `.gitignore`, so pointing at the root silently skips it.
- `dist/index.css` still ships everything that **isn't** JIT-scan-dependent
  in the normal sense: `@theme` registrations, `@font-face`s, and hand-written
  CSS like `.prose`.
- Custom `@utility` classes we define ourselves (e.g. `z-stack`) *are*
  scan-dependent even though they're not stock Tailwind utilities — the JIT
  compiler only emits a utility's CSS if it sees the class name used
  somewhere. Since scanning our own `.tsx` is disabled, any such utility
  needs an explicit `@source inline("name");` right next to its `@utility`
  definition, or it silently disappears from the build.
- Storybook (`.storybook/preview.tsx`) is the one place that still wants the
  full internal scan — it imports `.storybook/preview-source.css`, which
  re-enables it via `@source '../src/**/*.{ts,tsx}';`, independently of the
  `source(none)` used for the published package.

---

When working on UI components, always use the `gestral-ui-storybook` MCP tools to access Storybook's component and documentation knowledge before answering or taking any action.
 
- **CRITICAL: Never hallucinate component properties!** Before using ANY property on a component from a design system (including common-sounding ones like `shadow`, etc.), you MUST use the MCP tools to check if the property is actually documented for that component.
- Query `list-all-documentation` to get a list of all components
- Query `get-documentation` for that component to see all available properties and examples
- Only use properties that are explicitly documented or shown in example stories
- If a property isn't documented, do not assume properties based on naming conventions or common patterns from other libraries. Check back with the user in these cases.
- Use the `get-storybook-story-instructions` tool to fetch the latest instructions for creating or updating stories. This will ensure you follow current conventions and recommendations.
- Check your work by running `run-story-tests`.
 
Remember: A story name might not reflect the property name correctly, so always verify properties through documentation or example stories before using them.