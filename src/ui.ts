import { gameState } from './state';
import { initGame } from './game';

/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */

const btnPlay = document.getElementById('btnPlay') as HTMLButtonElement;
const btnStart = document.getElementById('btn-start') as HTMLButtonElement;
const themePreview = document.getElementById('theme-preview') as HTMLImageElement;
const selectedThemeLabel = document.getElementById('selected-theme') as HTMLSpanElement;
const selectedPlayerLabel = document.getElementById('selected-player') as HTMLSpanElement;
const selectedSizeLabel = document.getElementById('selected-size') as HTMLSpanElement;

const themePreviews = {
  'code-vibes': '/img/01_themes/vibes_theme/vibe_theme.png',
  'gaming': '/img/01_themes/game_theme/game_theme.png',
};

/* ==========================================================================
   HELPERS
   ========================================================================== */

function checkStartEnabled(): void {
  const theme = document.querySelector<HTMLInputElement>('input[name="theme"]:checked');
  const player = document.querySelector<HTMLInputElement>('input[name="player"]:checked');
  const size = document.querySelector<HTMLInputElement>('input[name="board-size"]:checked');
  btnStart.disabled = !(theme && player && size);
}

/* ==========================================================================
   SETUP FUNCTIONS
   ========================================================================== */

function setupNavigation(): void {
  btnPlay?.addEventListener('click', () => showScreen('screen-settings'));
}

function setupResultScreen(): void {
  document.getElementById('btn-see-results')?.addEventListener('click', () => {
    const { scores } = gameState;
    const winnerEl = document.querySelector('.result__player-name');
    if (!winnerEl) return;

    if (scores.blue > scores.orange) {
      winnerEl.textContent = 'Blue Player';
    } else if (scores.orange > scores.blue) {
      winnerEl.textContent = 'Orange Player';
    } else {
      winnerEl.textContent = "It's a draw!";
    }

    showScreen('screen-result');
  });
}

function setupRestartButton(): void {
  document.getElementById('btn-restart')?.addEventListener('click', () => {
    showScreen('screen-home');
  });
}

function setupThemeRadios(): void {
  document.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (themePreview) {
        const themeKey = radio.value as keyof typeof themePreviews;
        themePreview.src = themePreviews[themeKey] ?? themePreviews['code-vibes'];
      }
      if (selectedThemeLabel) {
        selectedThemeLabel.textContent = radio.closest('label')?.textContent?.trim() ?? 'Game theme';
      }
      // document.body.dataset.theme = radio.value === 'gaming' ? 'gaming' : 'code-vibes';
      checkStartEnabled();
    });
  });
}

function setupPlayerRadios(): void {
  document.querySelectorAll<HTMLInputElement>('input[name="player"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (selectedPlayerLabel) selectedPlayerLabel.textContent = radio.closest('label')?.textContent?.trim() ?? 'Player';
      checkStartEnabled();
    });
  });
}

function setupBoardSizeRadios(): void {
  document.querySelectorAll<HTMLInputElement>('input[name="board-size"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (selectedSizeLabel) selectedSizeLabel.textContent = radio.closest('label')?.textContent?.trim() ?? 'Board size';
      checkStartEnabled();
    });
  });
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */

export function initUI(): void {
  showScreen('screen-home');
  setupNavigation();
  setupResultScreen();
  setupRestartButton();
  setupThemeRadios();
  setupPlayerRadios();
  setupBoardSizeRadios();
}

export function showScreen(screenId: string): void {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('screen--active'));
  document.getElementById(screenId)?.classList.add('screen--active');
}

btnStart?.addEventListener('click', () => {
  const theme = document.querySelector<HTMLInputElement>('input[name="theme"]:checked')?.value;
  const player = document.querySelector<HTMLInputElement>('input[name="player"]:checked')?.value;
  const size = document.querySelector<HTMLInputElement>('input[name="board-size"]:checked')?.value;

  gameState.theme = theme as 'code-vibes' | 'gaming';
  gameState.player = (player ?? 'blue') as 'blue' | 'orange';
  gameState.boardSize = parseInt(size ?? '16');

  document.body.dataset.theme = gameState.theme;

  initGame(); 
  showScreen('screen-game');
});