
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


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/* ==========================================================================
   SETUP & EXIT FUNCTIONS
   ========================================================================== */

/**
 * @description Resets the game state to its initial values.
 */
function resetState(): void {
  gameState.currentPlayer = gameState.player;
  gameState.scores = { blue: 0, orange: 0 };
  gameState.flippedCards = [];
  gameState.matchedPairs = 0;
  gameState.isLocked = false;
}

/**
 * @description  Handles the exit confirmation by resetting the game state, applying the default theme, and showing the settings screen.
 */
function handleExitConfirmation(): void {
  resetState();
  document.body.dataset.theme = 'code-vibes';
  showSettingsScreen();
}

/* ==========================================================================
    MATCH LOGIC (EINE AUFGABE PRO FUNKTION)
   ========================================================================== */

/**
 * @description Applies the matched state to the two matched cards, updates the score for the current player, and checks if the game has ended.
 * @param {HTMLElement} first - The first card that was flipped and matched.
 * @param {HTMLElement} second - The second card that was flipped and matched.
 */
function applyMatchState(first: HTMLElement, second: HTMLElement): void {
  const playerClass = `card--matched-${gameState.currentPlayer}`;
  first.classList.add('is-matched', playerClass);
  second.classList.add('is-matched', playerClass);

  gameState.scores[gameState.currentPlayer]++;
  gameState.matchedPairs++;
  gameState.flippedCards = [];
  gameState.isLocked = false;
}

/**
 * @description Determines the winner of the game and updates the final result screen accordingly, showing either the winner or a draw message.
 */
function showFinalResultScreen(): void {
  const winner = getWinner();
  if (winner === 'draw') {
    showDrawScreen();
    updateDrawScreen();

  } else {
    showWinnerScreen();
    updateWinnerScreen(winner);

  }
}

/**
 * @description Runs the end-of-game sequence by showing the game over screen, updating it, and then showing the final result screen after a delay.
 * @return {*}  {Promise<void>} - A promise that resolves when the end-of-game sequence is complete.
 */
async function runEndOfGameSequence(): Promise<void> {
  await delay(1500);
  showGameOverScreen();
  updateGameOverScreen();

  await delay(3000); 
  showFinalResultScreen();
}

/**
 * @description Handles the logic when two cards are matched, updating the game state and checking for the end of the game.
 * @param {HTMLElement} first - The first card that was flipped and matched.
 * @param {HTMLElement} second - The second card that was flipped and matched.  
 */
function handleMatch(first: HTMLElement, second: HTMLElement): void {
  applyMatchState(first, second);
  updateHeader();

  if (gameState.matchedPairs === gameState.boardSize / 2) {
    runEndOfGameSequence();
  }
}

/**
 * @description Handles the logic when two flipped cards do not match, flipping them back over after a delay and switching the current player.
 * @param {HTMLElement} first - The first card that was flipped and did not match.
 * @param {HTMLElement} second - The second card that was flipped and did not match.
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
 * @description Checks if the two flipped cards match by comparing their data values, and calls the appropriate handler for a match or mismatch.
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

/* ==========================================================================
   CLICK INTERACTION
   ========================================================================== */

/**
 * @description Determines if a card click is invalid by checking if the game is currently locked or if the card is already flipped or matched.
 * @param {HTMLElement} card - The card element that was clicked.
 * @return {*}  {boolean} - Returns true if the click is invalid, false otherwise.
 */
function isCardClickInvalid(card: HTMLElement): boolean {
  return (
    gameState.isLocked ||
    card.classList.contains('is-flipped') ||
    card.classList.contains('is-matched')
  );
}
/**
 * @description Handles the logic when a card is clicked, flipping it and checking for matches if two cards are flipped. It also checks for invalid clicks to prevent actions when the game is locked or the card is already flipped or matched.
 * @param {HTMLElement} card - The card element that was clicked.
 * @return {*}  {void} 
 */
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

/** 
 * @description Initializes the game by setting up the grid, header, and exit modal, and resetting the game state.
 * @export 
 * @return {*}  {void} - Returns nothing, but sets up the game interface and state for a new game session.
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