import { gameState } from './state';
import { showScreen } from './ui';

/* ==========================================================================
   HELPERS
   ========================================================================== */

function getThemeFolder(): string {
  return gameState.theme === 'gaming' ? 'game_theme' : 'vibes_theme';
}

function getPlayerIcon(player: 'blue' | 'orange'): string {
  if (gameState.theme === 'gaming') {
    return `/img/00_general/chess_${player}.png`;
  }
  return `/img/00_general/label_${player}.svg`;
}

function shuffleArray(arr: number[]): number[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

/* ==========================================================================
   TEMPLATES
   ========================================================================== */

function headerTemplate(): string {
  const showColorLabels = gameState.theme !== 'gaming';
  const backButtonText = gameState.theme === 'gaming' ? 'No, back to game' : 'Back to game';
  const exitButtonText = gameState.theme === 'gaming' ? 'Yes, quit game' : 'Exit game';

  return `
    <div class="game__status">
      <div class="status__scores">
        <span class="score score--blue">
          <img class="score__icon" src="${getPlayerIcon('blue')}" alt="">
          ${showColorLabels ? 'Blue ' : ''}<span class="score__value">0</span>
        </span>
        <span class="score score--orange">
          <img class="score__icon" src="${getPlayerIcon('orange')}" alt="">
          ${showColorLabels ? 'Orange ' : ''}<span class="score__value">0</span>
        </span>
      </div>
      <div class="status__current">
        Current player:
        <img class="current-indicator" src="${getPlayerIcon(gameState.player)}" alt="${gameState.player}">
      </div>
      <button id="btn-exit-game" class="btn btn--exit" type="button">
        <img src="/img/00_general/move_item.png" alt=""> Exit game
      </button>
    </div>
    <div id="exit-game-modal" class="game-exit-modal" aria-hidden="true">
      <div class="game-exit-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="exit-game-title">
        <p id="exit-game-title" class="game-exit-modal__text">Are you sure you want to quit the game?</p>
        <div class="game-exit-modal__actions">
          <button id="btn-back-to-game" class="btn btn--exit game-exit-modal__btn game-exit-modal__btn--back" type="button">${backButtonText}</button>
          <button id="btn-confirm-exit" class="btn btn--exit game-exit-modal__btn game-exit-modal__btn--exit" type="button">${exitButtonText}</button>
        </div>
      </div>
    </div>
  `;
}

function cardTemplate(val: number, themeFolder: string): string {
  return `
    <div class="card__inner">
      <div class="card__front">
        <img src="/img/01_themes/${themeFolder}/cards/card_background.png" alt="">
      </div>
      <div class="card__back">
        <img src="/img/01_themes/${themeFolder}/cards/card${val}.png" alt="Card ${val}">
      </div>
    </div>
  `;
}

/* ==========================================================================
   SETUP FUNCTIONS
   ========================================================================== */

function resetState(): void {
  gameState.currentPlayer = gameState.player;
  gameState.scores = { blue: 0, orange: 0 };
  gameState.flippedCards = [];
  gameState.matchedPairs = 0;
  gameState.isLocked = false;
}

function buildHeader(header: Element): void {
  header.innerHTML = headerTemplate();
}

type ExitModalElements = {
  exitBtn: HTMLButtonElement;
  modal: HTMLElement;
  backBtn: HTMLButtonElement;
  confirmBtn: HTMLButtonElement;
};

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

function openExitModal(modal: HTMLElement): void {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeExitModal(modal: HTMLElement): void {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

function handleExitConfirmation(modal: HTMLElement): void {
  resetState();
  closeExitModal(modal);
  document.body.dataset.theme = 'code-vibes';
  showScreen('screen-settings');
}

function bindExitModalEvents(elements: ExitModalElements): void {
  const { exitBtn, modal, backBtn, confirmBtn } = elements;

  exitBtn.addEventListener('click', () => openExitModal(modal));
  backBtn.addEventListener('click', () => closeExitModal(modal));
  confirmBtn.addEventListener('click', () => handleExitConfirmation(modal));

  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeExitModal(modal);
    }
  });
}

function setupExitModal(header: Element): void {
  const elements = getExitModalElements(header);
  if (!elements) return;

  bindExitModalEvents(elements);
}

function createCardValues(): number[] {
  const pairCount = gameState.boardSize / 2;
  const values: number[] = [];
  for (let i = 1; i <= pairCount; i++) {
    values.push(i, i);
  }
  return shuffleArray(values);
}

function createCard(val: number): HTMLButtonElement {
  const card = document.createElement('button');
  card.className = 'card';
  card.dataset.value = val.toString();
  card.innerHTML = cardTemplate(val, getThemeFolder());
  card.addEventListener('click', () => handleCardClick(card));
  return card;
}

function buildGrid(grid: HTMLElement): void {
  grid.innerHTML = '';
  grid.className = `game-board__grid grid--${gameState.boardSize}`;

  const cardValues = createCardValues();
  cardValues.forEach(val => grid.appendChild(createCard(val)));
}

/* ==========================================================================
   GAME LOGIC
   ========================================================================== */

function updateHeader(): void {
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

function updateGameOverScreen(): void {
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

function handleMatch(first: HTMLElement, second: HTMLElement): void {
  first.classList.add('is-matched', `card--matched-${gameState.currentPlayer}`);
  second.classList.add('is-matched', `card--matched-${gameState.currentPlayer}`);

  gameState.scores[gameState.currentPlayer]++;
  gameState.matchedPairs++;
  gameState.flippedCards = [];
  gameState.isLocked = false;

  updateHeader();

  if (gameState.matchedPairs === gameState.boardSize / 2) {
    setTimeout(() => {
      updateGameOverScreen();
      showScreen('screen-gameover');
    }, 800);
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

export function initGame(): void {
  const grid = document.getElementById('memory-grid');
  const header = document.querySelector('.game__header');
  if (!grid || !header) return;

  resetState();
  buildHeader(header);
  setupExitModal(header);
  buildGrid(grid);
}
