
import { assetPath } from '../assets';
import type { Theme } from '../types';

/* ==========================================================================
  THEME CONFIG & HELPERS
  ========================================================================== */

export const themePreviews = {
  'code-vibes': assetPath('/img/01_themes/vibes_theme/vibe_theme.png'),
  'gaming': assetPath('/img/01_themes/game_theme/game_theme.png'),
};

export function getActiveTheme(): Theme {
  return document.body.dataset.theme === 'gaming' ? 'gaming' : 'code-vibes';
}

/* ==========================================================================
  DYNAMIC ENDSCREEN THEMING 
  ========================================================================== */

/**
 * @description Applies the appropriate labels to the end screen buttons based on the selected theme.
 * @export
 * @param {Theme} theme - The currently active theme, which determines the button labels to be applied.
 */
export function applyEndScreenButtonLabels(theme: Theme): void {
  const label = theme === 'gaming' ? 'home' : 'Back to start';
  const winnerButton = document.getElementById('btn-back-to-start-winner');
  const drawButton = document.getElementById('btn-back-to-start-draw');

  if (winnerButton) winnerButton.textContent = label;
  if (drawButton) drawButton.textContent = label;
}

/**
 * @description Applies the appropriate theme assets to the end screen based on the selected theme.
 * @export
 * @param {Theme} theme - The currently active theme, which determines the assets to be applied.
 */
export function applyEndScreenThemeAssets(theme: Theme): void {
  const drawIcon = document.querySelector<HTMLImageElement>('.draw__icon');
  if (!drawIcon) return;

  drawIcon.src = theme === 'gaming'
    ? assetPath('/img/00_general/draw_icon_game.png')
    : assetPath('/img/00_general/draw_icon_code.png');
}

/**
 * @description Synchronizes the end screen theme by applying the appropriate button labels and theme assets based on the selected theme.
 * @export
 * @param {Theme} theme - The currently active theme, which determines the end screen elements to be updated.
 */
export function syncEndScreenTheme(theme: Theme): void {
  applyEndScreenButtonLabels(theme);
  applyEndScreenThemeAssets(theme);
}