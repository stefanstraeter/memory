import { gameState } from '../state';
import { showScreen } from '../ui/ui';
import { getWinner } from './helpers';
import { buildGrid, buildHeader, setupExitModal, updateDrawScreen, updateGameOverScreen, updateHeader, updateWinnerScreen } from './ui';

/* ==========================================================================
   SETUP FUNCTIONS
   ========================================================================== */

/**
 * Resets runtime game state for a fresh match.
 */
function resetState(): void {
  gameState.currentPlayer = gameState.player;
  gameState.scores = { blue: 0, orange: 0 };
  gameState.flippedCards = [];
  gameState.matchedPairs = 0;
  gameState.isLocked = false;
}

/**
 * Handles confirmed game exit and returns to settings.
 */
function handleExitConfirmation(): void {
  resetState();
  document.body.dataset.theme = 'code-vibes';
  showScreen('screen-settings');
}

/* ==========================================================================
    VIEW UPDATERS
   ========================================================================== */

/**
 * Applies all state updates after a successful match.
 *
 * @param first - First matched card.
 * @param second - Second matched card.
 */
function applyMatchState(first: HTMLElement, second: HTMLElement): void {
  first.classList.add('is-matched', `card--matched-${gameState.currentPlayer}`);
  second.classList.add('is-matched', `card--matched-${gameState.currentPlayer}`);

  gameState.scores[gameState.currentPlayer]++;
  gameState.matchedPairs++;
  gameState.flippedCards = [];
  gameState.isLocked = false;

  updateHeader();
}

/**
 * Shows the winner or draw screen after the game-over screen has been visible.
 */
function showFinalResultScreen(): void {
  const winner = getWinner();
  if (winner === 'draw') {
    updateDrawScreen();
    showScreen('screen-draw');
    return;
  }

  updateWinnerScreen(winner);
  showScreen('screen-winner');
}

/**
 * Runs the end-of-game screen sequence.
 */
function runEndOfGameSequence(): void {
  setTimeout(() => {
    updateGameOverScreen();
    showScreen('screen-gameover');

    setTimeout(() => {
      showFinalResultScreen();
    }, 3000);
  }, 2000);
}

/**
 * Handles a successful pair match.
 *
 * @param first - First matched card.
 * @param second - Second matched card.
 */
function handleMatch(first: HTMLElement, second: HTMLElement): void {
  applyMatchState(first, second);

  if (gameState.matchedPairs === gameState.boardSize / 2) {
    runEndOfGameSequence();
  }
}

/**
 * Handles a mismatch and switches current player.
 *
 * @param first - First flipped card.
 * @param second - Second flipped card.
 */
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

/**
 * Compares the two flipped cards and routes to match/mismatch flow.
 */
function checkMatch(): void {
  const [first, second] = gameState.flippedCards;
  const isMatch = first.dataset.value === second.dataset.value;

  if (isMatch) {
    handleMatch(first, second);
  } else {
    handleMismatch(first, second);
  }
}

/**
 * Handles click interaction for a single card.
 *
 * @param card - Clicked card element.
 */
function handleCardClick(card: HTMLElement): void {
  if (gameState.isLocked) return;
  if (card.classList.contains('is-flipped')) return;
  if (card.classList.contains('is-matched')) return;

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

/**
 * Initializes game UI and event handlers for a new match.
 */
export function initGame(): void {
  const grid = document.getElementById('memory-grid');
  const header = document.querySelector('.game__header');
  if (!grid || !header) return;

  resetState();
  buildHeader(header);
  setupExitModal(header, handleExitConfirmation);
  buildGrid(grid, handleCardClick);
}
