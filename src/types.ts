/* ==========================================================================
  TYPES
  ========================================================================== */

export type Theme = 'code-vibes' | 'gaming';

export type Player = 'blue' | 'orange';

export type Winner = 'blue' | 'orange' | 'draw';

export type HeaderTemplateData = {
  showColorLabels: boolean;
  backButtonText: string;
  exitButtonText: string;
  blueIcon: string;
  orangeIcon: string;
  currentPlayerIcon: string;
  currentPlayerAlt: Player;
};

export type ExitModalElements = {
  exitBtn: HTMLButtonElement;
  modal: HTMLElement;
  backBtn: HTMLButtonElement;
  confirmBtn: HTMLButtonElement;
};

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
