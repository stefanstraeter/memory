import { gameState } from '../state';
import { assetPath } from '../assets';
import type { Player, Winner } from '../types';

/* ==========================================================================
  ASSET HELPERS
  ========================================================================== */

/**
 * Resolves card image folder by active theme.
 *
 * @returns Theme folder name under public assets.
 */
export function getThemeFolder(): string {
  return gameState.theme === 'gaming' ? 'game_theme' : 'vibes_theme';
}

/**
 * Resolves a player icon for score and status views.
 *
 * @param player - Player color key.
 * @returns Icon path.
 */
export function getPlayerIcon(player: Player): string {
  if (gameState.theme === 'gaming') {
    return assetPath(`/img/00_general/chess_${player}.png`);
  }
  return assetPath(`/img/00_general/label_${player}.svg`);
}

/**
 * Resolves winner icon by theme.
 *
 * @param player - Winning player.
 * @returns Winner icon path.
 */
export function getWinnerIcon(player: Player): string {
  const activeTheme = document.body.dataset.theme === 'gaming' ? 'gaming' : 'code-vibes';

  if (activeTheme === 'gaming') {
    return assetPath('/img/00_general/draw_icon_game.png');
  }

  return assetPath(`/img/00_general/chess_${player}.png`);
}

/**
 * Resolves draw icon by active theme.
 *
 * @returns Draw icon path.
 */
export function getDrawIcon(): string {
  const activeTheme = document.body.dataset.theme === 'gaming' ? 'gaming' : 'code-vibes';
  return activeTheme === 'gaming'
    ? assetPath('/img/00_general/draw_icon_game.png')
    : assetPath('/img/00_general/draw_icon_code.png');
}

/* ==========================================================================
  RESULT HELPERS
  ========================================================================== */

/**
 * Computes game winner from current scores.
 *
 * @returns Winning player or draw.
 */
export function getWinner(): Winner {
  if (gameState.scores.blue > gameState.scores.orange) return 'blue';
  if (gameState.scores.orange > gameState.scores.blue) return 'orange';
  return 'draw';
}

/**
 * Maps winner key to display label.
 *
 * @param winner - Non-draw winner.
 * @returns Uppercase winner label.
 */
export function getWinnerLabel(winner: Exclude<Winner, 'draw'>): string {
  return winner === 'blue' ? 'BLUE PLAYER' : 'ORANGE PLAYER';
}

/* ==========================================================================
   CARD SHUFFLE AND VALUE HELPERS
   ========================================================================== */

/**
 * In-place Fisher-Yates shuffle.
 *
 * @param arr - Card values to shuffle.
 * @returns Shuffled array.
 */
function shuffleArray(arr: number[]): number[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

/**
 * Creates paired card values and shuffles them for the board.
 *
 * @param boardSize - Number of cards on the board.
 * @returns Shuffled value list with pairs.
 */
export function createCardValues(boardSize: number): number[] {
  const pairCount = boardSize / 2;
  const values: number[] = [];
  for (let i = 1; i <= pairCount; i++) {
    values.push(i, i);
  }
  return shuffleArray(values);
}
