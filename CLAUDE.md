# Gestral UI

## Design Philosophy

See `DESIGN.md` for the canonical v2 design philosophy.

The short version: Gestral's visual language is a **deconstructed design tool UI**, borrowing structural vocabulary from Figma (left rail, frame labels, node tree, artboard containers) without mimicking it directly. The result should feel like a personal site built by someone who lives in design tools.

---

## Architecture

- **Vite** library mode, **Tailwind v4**, **Storybook** Connect
- Tokens are hand-authored in `src/styles/tokens.css` — no generation pipeline
- `src/styles/theme.css` is the consumable stylesheet for downstream apps (exported as `./theme`)
- Components live in `src/components/`, each with a `.tsx` and a `.stories.tsx`
- No hex values in component code — all colours reference semantic tokens (`chrome.*`, `canvas.*`, `editorial.*`, `accent.*`, `category.work.*`)

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