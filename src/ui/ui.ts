import { gameState } from '../state';
import { initGame } from '../game';
import { assetPath } from '../assets';
import {
  createDrawScreenTemplate,
  createGameOverScreenTemplate,
  createGameScreenTemplate,
  createSettingsScreenTemplate,
  createWinnerScreenTemplate,
} from '../templates';
import { getActiveTheme, setupThemeSyncObserver, syncEndScreenTheme, type Theme } from './theme';

const themePreviews = {
  'code-vibes': assetPath('/img/01_themes/vibes_theme/vibe_theme.png'),
  'gaming': assetPath('/img/01_themes/game_theme/game_theme.png'),
};

let settingsBound = false;
let endScreensBound = false;

/* ==========================================================================
   HELPERS
   ========================================================================== */

/**
 * Enables the start button only when all required settings are selected.
 */
function checkStartEnabled(): void {
  const btnStart = document.getElementById('btn-start') as HTMLButtonElement | null;
  if (!btnStart) return;

  const theme = document.querySelector<HTMLInputElement>('input[name="theme"]:checked');
  const player = document.querySelector<HTMLInputElement>('input[name="player"]:checked');
  const size = document.querySelector<HTMLInputElement>('input[name="board-size"]:checked');
  btnStart.disabled = !(theme && player && size);
}

/**
 * Resolves the app root used to mount lazy screens.
 */
function getAppRoot(): HTMLElement | null {
  return document.getElementById('app');
}

/**
 * Mounts the settings screen if it is not in the DOM yet.
 */
function ensureSettingsScreen(): void {
  if (document.getElementById('screen-settings')) return;
  const appRoot = getAppRoot();
  if (!appRoot) return;
  appRoot.insertAdjacentHTML('beforeend', createSettingsScreenTemplate());
}

/**
 * Mounts game and end screens if they are not in the DOM yet.
 */
function ensureGameScreens(): void {
  const appRoot = getAppRoot();
  if (!appRoot) return;

  if (!document.getElementById('screen-game')) {
    appRoot.insertAdjacentHTML('beforeend', createGameScreenTemplate());
  }
  if (!document.getElementById('screen-gameover')) {
    appRoot.insertAdjacentHTML('beforeend', createGameOverScreenTemplate());
  }
  if (!document.getElementById('screen-winner')) {
    appRoot.insertAdjacentHTML('beforeend', createWinnerScreenTemplate());
  }
  if (!document.getElementById('screen-draw')) {
    appRoot.insertAdjacentHTML('beforeend', createDrawScreenTemplate());
  }
}

/* ==========================================================================
   SETUP FUNCTIONS
   ========================================================================== */

/**
 * Wires the home play button to open the settings screen.
 */
function setupNavigation(): void {
  const btnPlay = document.getElementById('btnPlay') as HTMLButtonElement | null;
  btnPlay?.addEventListener('click', () => {
    ensureSettingsScreen();
    if (!settingsBound) {
      setupThemeRadios();
      setupPlayerRadios();
      setupBoardSizeRadios();
      setupStartButton();
      settingsBound = true;
    }
    showScreen('screen-settings');
  });
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
      const themePreview = document.getElementById('theme-preview') as HTMLImageElement | null;
      const selectedThemeLabel = document.getElementById('selected-theme') as HTMLSpanElement | null;

      if (themePreview) {
        const themeKey = radio.value as keyof typeof themePreviews;
        themePreview.src = themePreviews[themeKey] ?? themePreviews['code-vibes'];
      }
      if (selectedThemeLabel) {
        selectedThemeLabel.textContent = radio.closest('label')?.textContent?.trim() ?? 'Game theme';
      }
      const nextTheme: Theme = radio.value === 'gaming' ? 'gaming' : 'code-vibes';
      syncEndScreenTheme(nextTheme);
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
      const selectedPlayerLabel = document.getElementById('selected-player') as HTMLSpanElement | null;
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
      const selectedSizeLabel = document.getElementById('selected-size') as HTMLSpanElement | null;
      if (selectedSizeLabel) selectedSizeLabel.textContent = radio.closest('label')?.textContent?.trim() ?? 'Board size';
      checkStartEnabled();
    });
  });
}

/**
 * Wires the start button to transfer settings into state and launch a game.
 */
function setupStartButton(): void {
  const btnStart = document.getElementById('btn-start') as HTMLButtonElement | null;

  btnStart?.addEventListener('click', () => {
    const theme = document.querySelector<HTMLInputElement>('input[name="theme"]:checked')?.value;
    const player = document.querySelector<HTMLInputElement>('input[name="player"]:checked')?.value;
    const size = document.querySelector<HTMLInputElement>('input[name="board-size"]:checked')?.value;

    gameState.theme = (theme ?? 'code-vibes') as Theme;
    gameState.player = (player ?? 'blue') as 'blue' | 'orange';
    gameState.boardSize = parseInt(size ?? '16');

    document.body.dataset.theme = gameState.theme;

    ensureGameScreens();
    if (!endScreensBound) {
      setupWinnerScreen();
      endScreensBound = true;
    }

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