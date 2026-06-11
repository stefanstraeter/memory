// src/game/game.ts
import { gameState } from '../state';
import { getWinner } from './helpers';
import { 
  showSettingsScreen, 
  showGameOverScreen, 
  showWinnerScreen, 
  showDrawScreen 
} from '../ui/navigation';
import { 
  buildGrid, 
  buildHeader, 
  setupExitModal, 
  updateDrawScreen, 
  updateGameOverScreen, 
  updateHeader, 
  updateWinnerScreen 
} from './view';

// Hilfsfunktion für lesbare Pausen ohne Callback-Verschachtelung
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/* ==========================================================================
   SETUP & EXIT FUNCTIONS
   ========================================================================== */

function resetState(): void {
  gameState.currentPlayer = gameState.player;
  gameState.scores = { blue: 0, orange: 0 };
  gameState.flippedCards = [];
  gameState.matchedPairs = 0;
  gameState.isLocked = false;
}

function handleExitConfirmation(): void {
  resetState();
  document.body.dataset.theme = 'code-vibes';
  showSettingsScreen();
}

/* ==========================================================================
    MATCH LOGIC (EINE AUFGABE PRO FUNKTION)
   ========================================================================== */

function applyMatchState(first: HTMLElement, second: HTMLElement): void {
  const playerClass = `card--matched-${gameState.currentPlayer}`;
  first.classList.add('is-matched', playerClass);
  second.classList.add('is-matched', playerClass);

  gameState.scores[gameState.currentPlayer]++;
  gameState.matchedPairs++;
  gameState.flippedCards = [];
  gameState.isLocked = false;
}

function showFinalResultScreen(): void {
  const winner = getWinner();
  if (winner === 'draw') {
    updateDrawScreen();
    showDrawScreen();
  } else {
    updateWinnerScreen(winner);
    showWinnerScreen();
  }
}

/**
 * Steuert den Ablauf am Spielende. Jede Zeile wartet lesbar ab.
 * Das Game Over bleibt exakt 3 Sekunden für den Spieler stehen!
 */
async function runEndOfGameSequence(): Promise<void> {
  await delay(1500);
  showGameOverScreen();
  updateGameOverScreen();

  await delay(3000); 
  showFinalResultScreen();
}

function handleMatch(first: HTMLElement, second: HTMLElement): void {
  applyMatchState(first, second);
  updateHeader();

  if (gameState.matchedPairs === gameState.boardSize / 2) {
    runEndOfGameSequence();
  }
}

function handleMismatch(first: HTMLElement, second: HTMLElement): void {
  setTimeout(() => {
    first.classList.remove('is-flipped');
    second.classList.remove('is-flipped');

    gameState.flippedCards = [];
    gameState.currentPlayer = gameState.currentPlayer === 'blue' ? 'orange' : 'blue';
    gameState.isLocked = false;

    updateHeader();
  }, 1000);
}

function checkMatch(): void {
  const [first, second] = gameState.flippedCards;
  const isMatch = first.dataset.value === second.dataset.value;

  if (isMatch) {
    handleMatch(first, second);
  } else {
    handleMismatch(first, second);
  }
}

/* ==========================================================================
   CLICK INTERACTION
   ========================================================================== */

function isCardClickInvalid(card: HTMLElement): boolean {
  return (
    gameState.isLocked ||
    card.classList.contains('is-flipped') ||
    card.classList.contains('is-matched')
  );
}

function handleCardClick(card: HTMLElement): void {
  if (isCardClickInvalid(card)) return;

  card.classList.add('is-flipped');
  gameState.flippedCards.push(card);

  if (gameState.flippedCards.length === 2) {
    gameState.isLocked = true;
    checkMatch();
  }
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */

export function initGame(): void {
  const grid = document.getElementById('memory-grid');
  const header = document.querySelector('.game__header');
  if (!grid || !header) return;

  resetState();
  buildHeader(header);
  setupExitModal(header, handleExitConfirmation);
  buildGrid(grid, handleCardClick);
}