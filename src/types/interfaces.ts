/* ==========================================================================
  INTERFACES
  ========================================================================== */

/**
 * Central runtime state shared by UI and game modules.
 */
export interface GameState {
  // Settings (set before game starts)
  theme: 'code-vibes' | 'gaming';
  player: 'blue' | 'orange';
  boardSize: number;
  currentPlayer: 'blue' | 'orange';
  scores: { blue: number; orange: number };
  flippedCards: HTMLElement[];
  matchedPairs: number;
  isLocked: boolean;
}
