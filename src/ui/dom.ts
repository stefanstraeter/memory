import { assetPath } from '../assets';

/* ==========================================================================
  DOM REFERENCES
  ========================================================================== */

export const btnPlay = document.getElementById('btnPlay') as HTMLButtonElement;
export const btnStart = document.getElementById('btn-start') as HTMLButtonElement;
export const themePreview = document.getElementById('theme-preview') as HTMLImageElement;
export const selectedThemeLabel = document.getElementById('selected-theme') as HTMLSpanElement;
export const selectedPlayerLabel = document.getElementById('selected-player') as HTMLSpanElement;
export const selectedSizeLabel = document.getElementById('selected-size') as HTMLSpanElement;

/* ==========================================================================
  STATIC ASSET MAPS
  ========================================================================== */

/**
 * Theme preview image paths by theme key.
 */
export const themePreviews = {
  'code-vibes': assetPath('/img/01_themes/vibes_theme/vibe_theme.png'),
  'gaming': assetPath('/img/01_themes/game_theme/game_theme.png'),
};
