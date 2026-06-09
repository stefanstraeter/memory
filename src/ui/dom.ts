/* ==========================================================================
  DOM REFERENCES
  ========================================================================== */

/**
 * Home screen play button.
 */
export const btnPlay = document.getElementById('btnPlay') as HTMLButtonElement;
/**
 * Settings screen start button.
 */
export const btnStart = document.getElementById('btn-start') as HTMLButtonElement;
/**
 * Theme preview image in settings.
 */
export const themePreview = document.getElementById('theme-preview') as HTMLImageElement;
/**
 * Selected theme label in summary card.
 */
export const selectedThemeLabel = document.getElementById('selected-theme') as HTMLSpanElement;
/**
 * Selected player label in summary card.
 */
export const selectedPlayerLabel = document.getElementById('selected-player') as HTMLSpanElement;
/**
 * Selected board-size label in summary card.
 */
export const selectedSizeLabel = document.getElementById('selected-size') as HTMLSpanElement;

/* ==========================================================================
  STATIC ASSET MAPS
  ========================================================================== */

/**
 * Theme preview image paths by theme key.
 */
export const themePreviews = {
  'code-vibes': '/img/01_themes/vibes_theme/vibe_theme.png',
  'gaming': '/img/01_themes/game_theme/game_theme.png',
};
