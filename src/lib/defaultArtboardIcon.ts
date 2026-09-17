import type { IconName } from '@primitives';

/**
 * Shared fallback icon for the "Layers"/Artboard metaphor — a Figma-style
 * frame. Both `Artboard`'s own label and `LayerList`'s rows (which mirror a
 * page's Artboards as a rail TOC) default to this unless overridden
 * per-instance, so an Artboard and its TOC entry read as the same "layer"
 * even when neither sets an explicit `icon`.
 */
export const DEFAULT_ARTBOARD_ICON: IconName = 'frame';
