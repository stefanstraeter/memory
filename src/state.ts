import type { GameState } from './types';

/* ==========================================================================
  DEFAULT STATE
  ========================================================================== */

/**
 * Mutable in-memory game state.
 */
export const gameState: GameState = {
  theme: 'code-vibes',
  player: 'blue',
  boardSize: 16,
  currentPlayer: 'blue',
  scores: { blue: 0, orange: 0 },
  flippedCards: [],
  matchedPairs: 0,
  isLocked: false,
};