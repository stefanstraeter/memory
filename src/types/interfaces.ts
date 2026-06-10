import type { Player, Theme } from './types';

/* ==========================================================================
  INTERFACES
  ========================================================================== */

/**
 * Central runtime state shared by UI and game modules.
 */
export interface GameState {
  // Settings (set before game starts)
  theme: Theme;
  player: Player;
  boardSize: number;
  currentPlayer: Player;
  scores: Record<Player, number>;
  flippedCards: HTMLElement[];
  matchedPairs: number;
  isLocked: boolean;
}
