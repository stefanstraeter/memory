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