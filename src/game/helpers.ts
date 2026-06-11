
import { gameState } from '../state';
import { assetPath } from '../assets';
import type { Player, Winner } from '../types';

/* ==========================================================================
   PURE LOGIC & GAME MECHANICS HELPERS
   ========================================================================== */

/**
 * @description Determines the winner of the game by comparing the scores of both players, returning 'blue', 'orange', or 'draw' accordingly.
 * @export
 * @return {*}  {Winner} - The winner of the game, which can be 'blue', 'orange', or 'draw'.
 */
export function getWinner(): Winner {
  if (gameState.scores.blue > gameState.scores.orange) return 'blue';
  if (gameState.scores.orange > gameState.scores.blue) return 'orange';
  return 'draw';
}

/**
 * @description Returns a human-readable label for the given winner, mapping 'blue' to 'BLUE PLAYER' and 'orange' to 'ORANGE PLAYER'.
 * @export
 * @param {Exclude<Winner, 'draw'>} winner - The winner of the game, which can be either 'blue' or 'orange' (but not 'draw').
 * @return {*}  {string} - A string label representing the winner, such as 'BLUE PLAYER' or 'ORANGE PLAYER'.
 */
export function getWinnerLabel(winner: Exclude<Winner, 'draw'>): string {
  return winner === 'blue' ? 'BLUE PLAYER' : 'ORANGE PLAYER';
}

/**
 * @description Applies the match state to the two matched cards by incrementing the current player's score, updating the matched pairs count, clearing the flipped cards array, and unlocking the game for the next turn.
 * @export
 * @param {number} boardSize - The total number of cards on the board, used to determine when the game has ended.
 * @return {*}  {number[]} - An array of numbers representing the shuffled card values for the game board, created based on the given board size.
 */
export function createCardValues(boardSize: number): number[] {
  const numberOfPairs = boardSize / 2;
  const uniqueValues: number[] = [];

  for (let i = 1; i <= numberOfPairs; i++) {
    uniqueValues.push(i);
  }

  const deck = [...uniqueValues, ...uniqueValues];

  return shuffle(deck);
}

/**
 * @description Shuffles an array of numbers using the Fisher-Yates algorithm, returning a new array with the elements in random order.
 * @param {number[]} array - The array of numbers to be shuffled.
 * @return {*}  {number[]} - A new array containing the same numbers as the input array but in a random order.
 */
function shuffle(array: number[]): number[] {
  const arr = [...array];  
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ==========================================================================
   UI & ASSET HELPERS 
   ========================================================================== */

/**
 * @description Returns the folder name for the current theme, which can be 'game_theme' or 'vibes_theme'.
 * @export
 * @return {*}  {string} - The folder name for the current theme.
 */
export function getThemeFolder(): string {
  return gameState.theme === 'gaming' ? 'game_theme' : 'vibes_theme';
}

/**
 * @description Returns the icon path for the given player based on the current theme.
 * @export
 * @param {Player} player - The player for whom to get the icon, which can be 'blue' or 'orange'.
 * @return {*}  {string} - The file path to the player's icon image, which varies based on the current theme.
 */
export function getPlayerIcon(player: Player): string {
  if (gameState.theme === 'gaming') {
    return assetPath(`/img/00_general/chess_${player}.png`);
  }
  return assetPath(`/img/00_general/label_${player}.svg`);
}

/** 
 * @description Returns the icon path for the given player based on the current theme, using a specific draw icon for the gaming theme and a chess piece icon for the code vibes theme.
 * @export
 * @param {Player} player - The player for whom to get the winner icon, which can be 'blue' or 'orange'.
 * @return {*}  {string} - The file path to the winner's icon image, which varies based on the current theme, using a draw icon for the gaming theme and a chess piece icon for the code vibes theme.
 */
export function getWinnerIcon(player: Player): string {
  const activeTheme = document.body.dataset.theme;
  if (activeTheme === 'gaming') {
    return assetPath('/img/00_general/draw_icon_game.png');
  }
  return assetPath(`/img/00_general/chess_${player}.png`);
}

/**
 * @description Returns the icon path for a draw result based on the current theme, using a specific draw icon for the gaming theme and a chess piece icon for the code vibes theme.
 * @export
 * @return {*}  {string} - The file path to the draw icon image, which varies based on the current theme, using a draw icon for the gaming theme and a chess piece icon for the code vibes theme.
 */
export function getDrawIcon(): string {
  const activeTheme = document.body.dataset.theme;
  return activeTheme === 'gaming'
    ? assetPath('/img/00_general/draw_icon_game.png')
    : assetPath('/img/00_general/draw_icon_code.png');
}