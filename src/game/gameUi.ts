import { gameState } from '../state';
import { createCardTemplate, createHeaderTemplate } from '../templates';
import { createCardValues, getDrawIcon, getPlayerIcon, getThemeFolder, getWinnerIcon, getWinnerLabel, type Winner } from './helpers';

/* ==========================================================================
  TYPES
  ========================================================================== */

type ExitModalElements = {
  exitBtn: HTMLButtonElement;
  modal: HTMLElement;
  backBtn: HTMLButtonElement;
  confirmBtn: HTMLButtonElement;
};

/* ==========================================================================
  EXIT MODAL INTERACTIONS
  ========================================================================== */

/**
 * Collects required exit-modal elements from header.
 *
 * @param header - Header root element.
 * @returns All modal elements or null if missing.
 */
function getExitModalElements(header: Element): ExitModalElements | null {
  const exitBtn = header.querySelector<HTMLButtonElement>('#btn-exit-game');
  const modal = header.querySelector<HTMLElement>('#exit-game-modal');
  const backBtn = header.querySelector<HTMLButtonElement>('#btn-back-to-game');
  const confirmBtn = header.querySelector<HTMLButtonElement>('#btn-confirm-exit');

  if (!exitBtn || !modal || !backBtn || !confirmBtn) {
    return null;
  }

  return { exitBtn, modal, backBtn, confirmBtn };
}

/**
 * Opens the exit confirmation modal.
 *
 * @param modal - Modal element.
 */
function openExitModal(modal: HTMLElement): void {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

/**
 * Closes the exit confirmation modal.
 *
 * @param modal - Modal element.
 */
function closeExitModal(modal: HTMLElement): void {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

/* ==========================================================================
  GAME INTERACTIONS
  ========================================================================== */

/**
 * Renders the game header with theme-specific content.
 *
 * @param header - Header root element.
 */
export function buildHeader(header: Element): void {
  const showColorLabels = gameState.theme !== 'gaming';
  const backButtonText = gameState.theme === 'gaming' ? 'No, back to game' : 'Back to game';
  const exitButtonText = gameState.theme === 'gaming' ? 'Yes, quit game' : 'Exit game';

  header.innerHTML = createHeaderTemplate({
    showColorLabels,
    backButtonText,
    exitButtonText,
    blueIcon: getPlayerIcon('blue'),
    orangeIcon: getPlayerIcon('orange'),
    currentPlayerIcon: getPlayerIcon(gameState.player),
    currentPlayerAlt: gameState.player,
  });
}

/**
 * Attaches all exit modal interactions.
 *
 * @param header - Header root element.
 * @param onExitConfirmed - Callback executed after confirming exit.
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

  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeExitModal(modal);
    }
  });
}

/**
 * Creates a clickable card element for the game grid.
 *
 * @param val - Card value id.
 * @param onCardClick - Click handler.
 * @returns Card button element.
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
 * Builds the board grid for the selected board size.
 *
 * @param grid - Grid root element.
 * @param onCardClick - Card click handler.
 */
export function buildGrid(grid: HTMLElement, onCardClick: (card: HTMLElement) => void): void {
  grid.innerHTML = '';
  grid.className = `game-board__grid grid--${gameState.boardSize}`;

  const cardValues = createCardValues(gameState.boardSize);
  cardValues.forEach(val => grid.appendChild(createCard(val, onCardClick)));
}

/* ==========================================================================
  UPDATERS FOR SCREEN CONTENT
  ========================================================================== */

/**
 * Updates live score and current-player indicator in header.
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
 * Updates game-over screen values and icons.
 */
export function updateGameOverScreen(): void {
  const blueIcon = document.getElementById('gameover-blue-icon') as HTMLImageElement | null;
  const orangeIcon = document.getElementById('gameover-orange-icon') as HTMLImageElement | null;
  const blueLabel = document.getElementById('gameover-blue-label');
  const orangeLabel = document.getElementById('gameover-orange-label');
  const blueScore = document.getElementById('gameover-blue-score');
  const orangeScore = document.getElementById('gameover-orange-score');

  if (blueIcon) blueIcon.src = getPlayerIcon('blue');
  if (orangeIcon) orangeIcon.src = getPlayerIcon('orange');

  const showColorLabels = gameState.theme !== 'gaming';
  if (blueLabel) blueLabel.textContent = showColorLabels ? 'Blue ' : '';
  if (orangeLabel) orangeLabel.textContent = showColorLabels ? 'Orange ' : '';

  if (blueScore) blueScore.textContent = `${gameState.scores.blue}`;
  if (orangeScore) orangeScore.textContent = `${gameState.scores.orange}`;
}

/**
 * Updates winner screen content for the winning player.
 *
 * @param winner - Winning player (no draw).
 */
export function updateWinnerScreen(winner: Exclude<Winner, 'draw'>): void {
  const screen = document.getElementById('screen-winner') as HTMLElement | null;
  const winnerCard = document.querySelector<HTMLElement>('.winner__winner');
  const winnerIcon = document.getElementById('winner-icon') as HTMLImageElement | null;
  const winnerName = document.getElementById('winner-name');
  const winnerBackButton = document.getElementById('btn-back-to-start-winner');

  if (!screen || !winnerName) return;

  screen.dataset.winner = winner;
  if (winnerCard) winnerCard.dataset.winner = winner;
  winnerName.textContent = getWinnerLabel(winner);
  if (winnerBackButton) {
    winnerBackButton.textContent = document.body.dataset.theme === 'gaming' ? 'home' : 'Back to start';
  }

  if (winnerIcon) {
    winnerIcon.src = getWinnerIcon(winner);
    winnerIcon.alt = gameState.theme === 'gaming' ? 'Winner trophy' : winner;
  }
}

/**
 * Updates draw screen icon and button label.
 */
export function updateDrawScreen(): void {
  const drawIcon = document.querySelector<HTMLImageElement>('.draw__icon');
  const drawBackButton = document.getElementById('btn-back-to-start-draw');
  if (!drawIcon) return;

  drawIcon.src = getDrawIcon();
  drawIcon.alt = 'Draw icon';
  if (drawBackButton) {
    drawBackButton.textContent = document.body.dataset.theme === 'gaming' ? 'home' : 'Back to start';
  }
}
