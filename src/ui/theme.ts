import { assetPath } from '../assets';

/* ==========================================================================
  TYPES
  ========================================================================== */

export type Theme = 'code-vibes' | 'gaming';

/* ==========================================================================
  THEME HELPERS
  ========================================================================== */

/**
 * Reads the active theme from the body dataset.
 *
 * @returns The normalized active theme.
 */
export function getActiveTheme(): Theme {
  return document.body.dataset.theme === 'gaming' ? 'gaming' : 'code-vibes';
}

/**
 * Applies theme-specific labels for end-screen back buttons.
 *
 * @param theme - Theme to render labels for.
 */
export function applyEndScreenButtonLabels(theme: Theme): void {
  const label = theme === 'gaming' ? 'home' : 'Back to start';
  const winnerButton = document.getElementById('btn-back-to-start-winner');
  const drawButton = document.getElementById('btn-back-to-start-draw');

  if (winnerButton) winnerButton.textContent = label;
  if (drawButton) drawButton.textContent = label;
}

/**
 * Applies theme-specific visual assets for end screens.
 *
 * @param theme - Theme to render assets for.
 */
export function applyEndScreenThemeAssets(theme: Theme): void {
  const drawIcon = document.querySelector<HTMLImageElement>('.draw__icon');
  if (!drawIcon) return;

  drawIcon.src = theme === 'gaming'
    ? assetPath('/img/00_general/draw_icon_game.png')
    : assetPath('/img/00_general/draw_icon_code.png');
  drawIcon.alt = 'Draw icon';
}

/**
 * Synchronizes all end-screen labels and assets to the given theme.
 *
 * @param theme - Theme to apply.
 */
export function syncEndScreenTheme(theme: Theme): void {
  applyEndScreenButtonLabels(theme);
  applyEndScreenThemeAssets(theme);
}

/**
 * Observes theme changes on the body and reapplies end-screen styles.
 */
export function setupThemeSyncObserver(): void {
  const observer = new MutationObserver(() => {
    syncEndScreenTheme(getActiveTheme());
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
}
