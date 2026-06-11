
import { gameState } from '../state';
import { createCardTemplate, createHeaderTemplate } from '../templates/game-templates';
import type { ExitModalElements, Winner } from '../types';
import { createCardValues, getDrawIcon, getPlayerIcon, getThemeFolder, getWinnerIcon, getWinnerLabel } from './helpers';

/* ==========================================================================
  EXIT MODAL HELPERS
  ========================================================================== */

/**
 * @description Retrieves the elements related to the exit modal from the header.
 * @param {Element} header - The header element containing the exit modal elements.
 * @return {ExitModalElements | null} - An object containing the exit button, modal, back button, and confirm button elements, or null if any of the elements are not found.  
 */
function getExitModalElements(header: Element): ExitModalElements | null {
  const exitBtn = header.querySelector<HTMLButtonElement>('#btn-exit-game');
  const modal = header.querySelector<HTMLElement>('#exit-game-modal');
  const backBtn = header.querySelector<HTMLButtonElement>('#btn-back-to-game');
  const confirmBtn = header.querySelector<HTMLButtonElement>('#btn-confirm-exit');

  if (!exitBtn || !modal || !backBtn || !confirmBtn) return null;
  return { exitBtn, modal, backBtn, confirmBtn };
}

/**
 * @description Opens the exit modal by adding the 'is-open' class and setting the 'aria-hidden' attribute to 'false'.
 * @param {HTMLElement} modal
 */
function openExitModal(modal: HTMLElement): void {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

/**
 * @description Closes the exit modal by removing the 'is-open' class and setting the 'aria-hidden' attribute to 'true'.
 * @param {HTMLElement} modal - The exit modal element to be closed.
 */
function closeExitModal(modal: HTMLElement): void {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

/**
 * @description Sets up the exit modal functionality by attaching event listeners to the exit, back, and confirm buttons.
 * @export
 * @param {Element} header - The header element containing the exit modal elements.
 */
export function setupExitModal(header: Element, onExitConfirmed: () => void): void {
  const elements = getExitModalElements(header);
  if (!elements) return;

  const { exitBtn, modal, backBtn, confirmBtn } = elements;
  exitBtn.addEventListener('click', () => openExitModal(modal));
  backBtn.addEventListener('click', () => closeExitModal(modal));
  confirmBtn.addEventListener('click', () => {
    closeExitModal(modal);
    onExitConfirmed();
  });
  modal.addEventListener('click', e => e.target === modal && closeExitModal(modal));
}

/* ==========================================================================
  GAME BOARD BUILDERS
  ========================================================================== */

/**
 * @description Builds the game header by setting its inner HTML using the createHeaderTemplate function and the current game state.
 * @export
 * @param {Element} header - The header element to be built.
 */
export function buildHeader(header: Element): void {
  const isGaming = gameState.theme === 'gaming';
  header.innerHTML = createHeaderTemplate({
    showColorLabels: !isGaming,
    backButtonText: isGaming ? 'No, back to game' : 'Back to game',
    exitButtonText: isGaming ? 'Yes, quit game' : 'Exit game',
    blueIcon: getPlayerIcon('blue'),
    orangeIcon: getPlayerIcon('orange'),
    currentPlayerIcon: getPlayerIcon(gameState.player),
    currentPlayerAlt: gameState.player,
  });
}

/**
 * @description Creates a card element with the specified value and click handler.
 * @param {number} val - The value to be assigned to the card's data attribute and used in the card template.
 * @param {(card: HTMLElement) => void} onCardClick - The function to be called when the card is clicked.
 * @return {HTMLButtonElement} - The created card element with the appropriate classes, data attributes, inner HTML, and click event listener.
 */
function createCard(val: number, onCardClick: (card: HTMLElement) => void): HTMLButtonElement {
  const card = document.createElement('button');
  card.className = 'card';
  card.dataset.value = val.toString();
  card.innerHTML = createCardTemplate(val, getThemeFolder());
  card.addEventListener('click', () => onCardClick(card));
  return card;
}

/**
 * @description Builds the game grid by clearing its content, setting its class based on the current board size, generating card values, and appending card elements created with the createCard function.
 * @export
 * @param {HTMLElement} grid - The grid element to be built.
 */
export function buildGrid(grid: HTMLElement, onCardClick: (card: HTMLElement) => void): void {
  grid.innerHTML = '';
  grid.className = `game-board__grid grid--${gameState.boardSize}`;

  const cardValues = createCardValues(gameState.boardSize);
  cardValues.forEach(val => grid.appendChild(createCard(val, onCardClick)));
}

/* ==========================================================================
  VIEW UPDATERS 
  ========================================================================== */
/**
 * @description Updates the header by setting the score values for both players and updating the current player indicator based on the current game state.
 * @export
 */
export function updateHeader(): void {
  const scoreBlue = document.querySelector('.score--blue .score__value');
  const scoreOrange = document.querySelector('.score--orange .score__value');
  const indicator = document.querySelector<HTMLImageElement>('.current-indicator');

  if (scoreBlue) scoreBlue.textContent = `${gameState.scores.blue}`;
  if (scoreOrange) scoreOrange.textContent = `${gameState.scores.orange}`;
  if (indicator) {
    indicator.src = getPlayerIcon(gameState.currentPlayer);
    indicator.alt = gameState.currentPlayer;
  }
}
/**
 * @description Updates the game over screen by setting the icons and scores for both players based on the current game state, and updating the labels according to the theme.
 * @export
 */
export function updateGameOverScreen(): void {
  const blueIcon = document.getElementById('gameover-blue-icon') as HTMLImageElement | null;
  const orangeIcon = document.getElementById('gameover-orange-icon') as HTMLImageElement | null;
  const blueScore = document.getElementById('gameover-blue-score');
  const orangeScore = document.getElementById('gameover-orange-score');

  if (blueIcon) blueIcon.src = getPlayerIcon('blue');
  if (orangeIcon) orangeIcon.src = getPlayerIcon('orange');
  if (blueScore) blueScore.textContent = `${gameState.scores.blue}`;
  if (orangeScore) orangeScore.textContent = `${gameState.scores.orange}`;
  
  updateGameOverLabels();
}

/**
 * @description Updates the game over labels by showing or hiding the player labels based on the current theme of the game. If the theme is 'gaming', the labels will be hidden; otherwise, they will be shown.
 * @export
 */
function updateGameOverLabels(): void {
  const blueLabel = document.getElementById('gameover-blue-label');
  const orangeLabel = document.getElementById('gameover-orange-label');
  const showLabels = gameState.theme !== 'gaming';

  if (blueLabel) blueLabel.textContent = showLabels ? 'Blue ' : '';
  if (orangeLabel) orangeLabel.textContent = showLabels ? 'Orange ' : '';
}

/**
 * @description Updates the winner screen by setting the winner's name and icon based on the provided winner parameter, and updating the back button text according to the current theme of the game.
 * @export
 * @param {Exclude<Winner, 'draw'>} winner - The winner of the game, which can be either 'blue' or 'orange', but not 'draw'.
 */
export function updateWinnerScreen(winner: Exclude<Winner, 'draw'>): void {
  const screen = document.getElementById('screen-winner');
  const winnerCard = document.querySelector<HTMLElement>('.winner__winner');
  const winnerName = document.getElementById('winner-name');

  if (!screen || !winnerName) return;

  screen.dataset.winner = winner;
  if (winnerCard) winnerCard.dataset.winner = winner;
  
  winnerName.textContent = winner === 'blue' ? 'Blue player' : 'Orange player';
  
  updateWinnerAssets(winner);
}

/**
 * @description Updates the winner screen assets by setting the winner icon and back button text based on the provided winner parameter and the current theme of the game. 
 * @param {Exclude<Winner, 'draw'>} winner - The winner of the game, which can be either 'blue' or 'orange', but not 'draw'.
 */
function updateWinnerAssets(winner: Exclude<Winner, 'draw'>): void {
  const icon = document.getElementById('winner-icon') as HTMLImageElement | null;
  const btn = document.getElementById('btn-back-to-start-winner');
  const isGaming = gameState.theme === 'gaming';

  if (btn) {
    btn.textContent = isGaming ? 'home' : 'Back to start';
  }
  if (icon) {
    icon.src = getWinnerIcon(winner);
    icon.alt = isGaming ? 'Winner trophy' : winner;
  }
}

/**
 * @description Updates the draw screen by setting the draw icon and back button text based on the current theme of the game.
 * @export
 */
export function updateDrawScreen(): void {
  const drawIcon = document.querySelector<HTMLImageElement>('.draw__icon');
  const btn = document.getElementById('btn-back-to-start-draw');
  const isGaming = document.body.dataset.theme === 'gaming';

  if (drawIcon) {
    drawIcon.src = getDrawIcon();
    drawIcon.alt = 'Draw icon';
  }
  if (btn) {
    btn.textContent = isGaming ? 'home' : 'Back to start';
  }
}