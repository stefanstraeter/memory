
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
  DYNAMIC ENDSCREEN THEMING (Just-in-Time aufgerufen)
  ========================================================================== */

export function applyEndScreenButtonLabels(theme: Theme): void {
  const label = theme === 'gaming' ? 'home' : 'Back to start';
  const winnerButton = document.getElementById('btn-back-to-start-winner');
  const drawButton = document.getElementById('btn-back-to-start-draw');

  if (winnerButton) winnerButton.textContent = label;
  if (drawButton) drawButton.textContent = label;
}

export function applyEndScreenThemeAssets(theme: Theme): void {
  const drawIcon = document.querySelector<HTMLImageElement>('.draw__icon');
  if (!drawIcon) return;

  drawIcon.src = theme === 'gaming'
    ? assetPath('/img/00_general/draw_icon_game.png')
    : assetPath('/img/00_general/draw_icon_code.png');
}

/**
 * Synchronisiert die Elemente – wird jetzt direkt aufgerufen, 
 * NACHDEM der Screen frisch ins DOM geladen wurde.
 */
export function syncEndScreenTheme(theme: Theme): void {
  applyEndScreenButtonLabels(theme);
  applyEndScreenThemeAssets(theme);
}