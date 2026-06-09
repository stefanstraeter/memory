import { gameState } from './state';
import { initGame } from './game';
import {
  btnPlay,
  btnStart,
  selectedPlayerLabel,
  selectedSizeLabel,
  selectedThemeLabel,
  themePreview,
  themePreviews,
} from './ui/dom';
import { getActiveTheme, setupThemeSyncObserver, syncEndScreenTheme, type Theme } from './ui/theme';

/* ==========================================================================
   HELPERS
   ========================================================================== */

/**
 * Enables the start button only when all required settings are selected.
 */
function checkStartEnabled(): void {
  const theme = document.querySelector<HTMLInputElement>('input[name="theme"]:checked');
  const player = document.querySelector<HTMLInputElement>('input[name="player"]:checked');
  const size = document.querySelector<HTMLInputElement>('input[name="board-size"]:checked');
  btnStart.disabled = !(theme && player && size);
}

/* ==========================================================================
   SETUP FUNCTIONS
   ========================================================================== */

/**
 * Wires the home play button to open the settings screen.
 */
function setupNavigation(): void {
  btnPlay?.addEventListener('click', () => showScreen('screen-settings'));
}

/**
 * Wires winner/draw screen buttons back to the home screen.
 */
function setupWinnerScreen(): void {
  const backButtons = [
    document.getElementById('btn-back-to-start-winner'),
    document.getElementById('btn-back-to-start-draw'),
  ];

  backButtons.forEach(button => {
    button?.addEventListener('click', () => {
      document.body.dataset.theme = 'code-vibes';
      showScreen('screen-home');
    });
  });
}

/**
 * Wires theme radio buttons and updates previews and labels.
 */
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
      const nextTheme: Theme = radio.value === 'gaming' ? 'gaming' : 'code-vibes';
      syncEndScreenTheme(nextTheme);
      // document.body.dataset.theme = radio.value === 'gaming' ? 'gaming' : 'code-vibes';
      checkStartEnabled();
    });
  });
}

/**
 * Wires player radio buttons and updates selected player label.
 */
function setupPlayerRadios(): void {
  document.querySelectorAll<HTMLInputElement>('input[name="player"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (selectedPlayerLabel) selectedPlayerLabel.textContent = radio.closest('label')?.textContent?.trim() ?? 'Player';
      checkStartEnabled();
    });
  });
}

/**
 * Wires board size radio buttons and updates selected board size label.
 */
function setupBoardSizeRadios(): void {
  document.querySelectorAll<HTMLInputElement>('input[name="board-size"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (selectedSizeLabel) selectedSizeLabel.textContent = radio.closest('label')?.textContent?.trim() ?? 'Board size';
      checkStartEnabled();
    });
  });
}

/**
 * Wires the start button to transfer settings into state and launch a game.
 */
function setupStartButton(): void {
  btnStart?.addEventListener('click', () => {
    const theme = document.querySelector<HTMLInputElement>('input[name="theme"]:checked')?.value;
    const player = document.querySelector<HTMLInputElement>('input[name="player"]:checked')?.value;
    const size = document.querySelector<HTMLInputElement>('input[name="board-size"]:checked')?.value;

    gameState.theme = (theme ?? 'code-vibes') as Theme;
    gameState.player = (player ?? 'blue') as 'blue' | 'orange';
    gameState.boardSize = parseInt(size ?? '16');

    document.body.dataset.theme = gameState.theme;

    initGame();
    showScreen('screen-game');
  });
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */

/**
 * Initializes all app UI listeners and default screen state.
 */
export function initUI(): void {
  showScreen('screen-home');
  syncEndScreenTheme(getActiveTheme());
  setupThemeSyncObserver();
  setupNavigation();
  setupWinnerScreen();
  setupThemeRadios();
  setupPlayerRadios();
  setupBoardSizeRadios();
  setupStartButton();
}

/**
 * Shows one screen and hides all others.
 *
 * @param screenId - Target screen element id.
 */
export function showScreen(screenId: string): void {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('screen--active'));
  document.getElementById(screenId)?.classList.add('screen--active');

  syncEndScreenTheme(getActiveTheme());
}