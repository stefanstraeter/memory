// src/game/view.ts
import { gameState } from '../state';
import { createCardTemplate, createHeaderTemplate } from '../templates/game-templates';
import type { ExitModalElements, Winner } from '../types';
import { createCardValues, getDrawIcon, getPlayerIcon, getThemeFolder, getWinnerIcon, getWinnerLabel } from './helpers';

/* ==========================================================================
  1. EXIT MODAL HELPERS (Maximal 14 Zeilen pro Funktion)
  ========================================================================== */

function getExitModalElements(header: Element): ExitModalElements | null {
  const exitBtn = header.querySelector<HTMLButtonElement>('#btn-exit-game');
  const modal = header.querySelector<HTMLElement>('#exit-game-modal');
  const backBtn = header.querySelector<HTMLButtonElement>('#btn-back-to-game');
  const confirmBtn = header.querySelector<HTMLButtonElement>('#btn-confirm-exit');

  if (!exitBtn || !modal || !backBtn || !confirmBtn) return null;
  return { exitBtn, modal, backBtn, confirmBtn };
}

function openExitModal(modal: HTMLElement): void {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeExitModal(modal: HTMLElement): void {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

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
  2. GAME BOARD BUILDERS
  ========================================================================== */

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

function createCard(val: number, onCardClick: (card: HTMLElement) => void): HTMLButtonElement {
  const card = document.createElement('button');
  card.className = 'card';
  card.dataset.value = val.toString();
  card.innerHTML = createCardTemplate(val, getThemeFolder());
  card.addEventListener('click', () => onCardClick(card));
  return card;
}

export function buildGrid(grid: HTMLElement, onCardClick: (card: HTMLElement) => void): void {
  grid.innerHTML = '';
  grid.className = `game-board__grid grid--${gameState.boardSize}`;

  const cardValues = createCardValues(gameState.boardSize);
  cardValues.forEach(val => grid.appendChild(createCard(val, onCardClick)));
}

/* ==========================================================================
  3. VIEW UPDATERS (Aufgeteilt in Mini-Aufgaben unter 14 Zeilen)
  ========================================================================== */

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

function updateGameOverLabels(): void {
  const blueLabel = document.getElementById('gameover-blue-label');
  const orangeLabel = document.getElementById('gameover-orange-label');
  const showLabels = gameState.theme !== 'gaming';

  if (blueLabel) blueLabel.textContent = showLabels ? 'Blue ' : '';
  if (orangeLabel) orangeLabel.textContent = showLabels ? 'Orange ' : '';
}

export function updateWinnerScreen(winner: Exclude<Winner, 'draw'>): void {
  const screen = document.getElementById('screen-winner');
  const winnerCard = document.querySelector<HTMLElement>('.winner__winner');
  const winnerName = document.getElementById('winner-name');

  if (!screen || !winnerName) return;
  screen.dataset.winner = winner;
  if (winnerCard) winnerCard.dataset.winner = winner;
  winnerName.textContent = getWinnerLabel(winner);

  updateWinnerAssets(winner);
}

function updateWinnerAssets(winner: Exclude<Winner, 'draw'>): void {
  const icon = document.getElementById('winner-icon') as HTMLImageElement | null;
  const btn = document.getElementById('btn-back-to-start-winner');
  const isGaming = document.body.dataset.theme === 'gaming';

  if (btn) btn.textContent = isGaming ? 'home' : 'Back to start';
  if (icon) {
    icon.src = getWinnerIcon(winner);
    icon.alt = isGaming ? 'Winner trophy' : winner;
  }
}

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