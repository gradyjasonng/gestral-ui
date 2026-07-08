/**
 * Backs the site-wide Artboard frame toggle (see CanvasRail and
 * `global.css`'s `data-artboard-frame` rules). The stored value is read on
 * `<html>` before hydration to avoid a flash of the wrong state — see
 * `ARTBOARD_FRAME_STORAGE_KEY` for wiring that bootstrap script up.
 */
export const ARTBOARD_FRAME_STORAGE_KEY = 'gestral-ui:artboard-frame';

export function getStoredFramePreference(): boolean {
  if (typeof window === 'undefined') return true;
  return window.localStorage.getItem(ARTBOARD_FRAME_STORAGE_KEY) !== 'off';
}

export function setStoredFramePreference(enabled: boolean) {
  window.localStorage.setItem(ARTBOARD_FRAME_STORAGE_KEY, enabled ? 'on' : 'off');
  document.documentElement.setAttribute('data-artboard-frame', enabled ? 'on' : 'off');
}
