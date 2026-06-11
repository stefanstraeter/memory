
import { gameState } from '../state';
import { initGame } from '../game/game';
import type { Theme } from '../types';
import { getActiveTheme, syncEndScreenTheme, themePreviews } from './theme'; 
import {
  createHomeScreenTemplate,
  createDrawScreenTemplate,
  createGameOverScreenTemplate,
  createGameScreenTemplate,
  createSettingsScreenTemplate,
  createVibesWinnerTemplate, 
  createGamingWinnerTemplate,
} from '../templates/screen-templates';

/* ==========================================================================
   CORE RENDERING FUNCTION
   ========================================================================== */

/**
 * @description Renders the provided HTML content into the main app container.
 * @param {string} htmlContent - The HTML string to be rendered on the screen.
 */
function renderScreen(htmlContent: string): void {
  const appRoot = document.getElementById('app');
  if (appRoot) {
    appRoot.innerHTML = htmlContent;
  }
}

/* ==========================================================================
  SCREEN RENDERING FUNCTIONS
   ========================================================================== */

/**
 * @description Displays the home screen and sets up its event listeners.
 * @export
 */
export function showHomeScreen(): void {
  renderScreen(createHomeScreenTemplate());
  setupHomeListeners();
}

/**
 * @description Displays the settings screen and sets up its event listeners.
 * @export
 */
export function showSettingsScreen(): void {
  renderScreen(createSettingsScreenTemplate());
  setupSettingsListeners();
}

/**
 * @description Displays the game screen and initializes the game logic.
 * @export
 */
export function showGameScreen(): void {
  renderScreen(createGameScreenTemplate());
  initGame();
}

/**
 * @description Displays the game over screen.
 * @export 
 */
export function showGameOverScreen(): void {
  renderScreen(createGameOverScreenTemplate());
}

/**
 * @description Displays the winner screen based on the active theme and synchronizes its styles.
 * @export
 */
export function showWinnerScreen(): void {
  const winnerHtml = gameState.theme === 'gaming' 
    ? createGamingWinnerTemplate() 
    : createVibesWinnerTemplate();

  renderScreen(winnerHtml);
  syncEndScreenTheme(getActiveTheme()); 
  setupEndScreenListeners();
}

/**
 * @description  Displays the draw screen and synchronizes its theme with the active theme.
 * @export
 */
export function showDrawScreen(): void {
  renderScreen(createDrawScreenTemplate());
  syncEndScreenTheme(getActiveTheme()); 
  setupEndScreenListeners();
}

/* ==========================================================================
   EVENT LISTENERS
   ========================================================================== */

/**
 * @description Sets up event listeners for the home screen.
 */
function setupHomeListeners(): void {
  document.getElementById('btnPlay')?.addEventListener('click', () => {
    showSettingsScreen();
  });
}

/**
 * @description Sets up event listeners for the end screen.
 */
function setupEndScreenListeners(): void {
  const btn = document.getElementById('btn-back-to-start-winner') || document.getElementById('btn-back-to-start-draw');
  btn?.addEventListener('click', () => {
    document.body.dataset.theme = 'code-vibes';
    showHomeScreen();
  });
}

/**
 * @description Sets up event listeners for the settings screen, including theme selection, player selection, board size selection, and the start button.
 */
function setupSettingsListeners(): void {
  setupThemeRadios();
  setupThemeHoverListeners();
  setupPlayerRadios();
  setupBoardSizeRadios();
  setupStartButton();
}

/* ==========================================================================
   SETTINGS INPUT HANDLERS
   ========================================================================== */

/**
 * @description Enables the start button only when all required settings (theme, player, board size) are selected.
 */
function checkStartEnabled(): void {
  const btnStart = document.getElementById('btn-start') as HTMLButtonElement | null;
  const theme = document.querySelector('input[name="theme"]:checked');
  const player = document.querySelector('input[name="player"]:checked');
  const size = document.querySelector('input[name="board-size"]:checked');

  if (btnStart) {
    btnStart.disabled = !(theme && player && size);
  }
}

/**
 * @description Updates the theme preview image and label based on the selected theme radio button.
 * @param {string} radioValue - The value of the selected theme radio button, used to determine which preview image to display.
 */
function updateThemePreview(radioValue: string): void {
  const preview = document.getElementById('theme-preview') as HTMLImageElement | null;
  const label = document.getElementById('selected-theme');
  const activeRadio = document.querySelector('input[name="theme"]:checked');

  if (preview) {
    const key = radioValue as keyof typeof themePreviews;
    preview.src = themePreviews[key] ?? themePreviews['code-vibes'];
  }
  if (label) {
    label.textContent = activeRadio?.closest('label')?.textContent?.trim() ?? 'Game theme';
  }
}

/**
 * @description Sets up event listeners for theme radio buttons to update the theme preview and synchronize the end screen theme when a new theme is selected. Also checks if the start button should be enabled based on the current selections.
 */
function setupThemeRadios(): void {
  document.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach(radio => {
    radio.addEventListener('change', () => {
      updateThemePreview(radio.value);
      const nextTheme: Theme = radio.value === 'gaming' ? 'gaming' : 'code-vibes';
      syncEndScreenTheme(nextTheme);
      checkStartEnabled();
    });
  });
}

/**
 * @description Sets up hover event listeners on theme radio button labels to temporarily update the theme preview when hovering over different theme options, and reverts to the active theme preview when the mouse leaves the label.
 */
function setupThemeHoverListeners(): void {
  document.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach(radio => {
    radio.closest('label')?.addEventListener('mouseenter', () => {
      updateThemePreview(radio.value);
    });
    radio.closest('label')?.addEventListener('mouseleave', () => {
      const activeRadio = document.querySelector<HTMLInputElement>('input[name="theme"]:checked');
      updateThemePreview(activeRadio?.value ?? 'code-vibes');
    });
  });
}

/**
 * @description Sets up event listeners for player radio buttons to update the selected player label and check if the start button should be enabled when a player option is selected.
 */
function setupPlayerRadios(): void {
  document.querySelectorAll<HTMLInputElement>('input[name="player"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const label = document.getElementById('selected-player');
      const text = radio.closest('label')?.textContent?.trim();
      if (label) {
        label.textContent = text ?? 'Player';
      }
      checkStartEnabled();
    });
  });
}

/**
 * @description Sets up event listeners for board size radio buttons to update the selected board size label and check if the start button should be enabled when a board size option is selected.
 */
function setupBoardSizeRadios(): void {
  document.querySelectorAll<HTMLInputElement>('input[name="board-size"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const label = document.getElementById('selected-size');
      const text = radio.closest('label')?.textContent?.trim();
      if (label) {
        label.textContent = text ?? 'Board size';
      }
      checkStartEnabled();
    });
  });
}

/**
 * @description Saves the selected settings (theme, player, board size) from the settings screen to the global game state and updates the document body's data-theme attribute to reflect the selected theme.
 */
function saveSettingsToState(): void {
  const theme = document.querySelector<HTMLInputElement>('input[name="theme"]:checked')?.value;
  const player = document.querySelector<HTMLInputElement>('input[name="player"]:checked')?.value;
  const size = document.querySelector<HTMLInputElement>('input[name="board-size"]:checked')?.value;

  gameState.theme = (theme ?? 'code-vibes') as Theme;
  gameState.player = (player ?? 'blue') as 'blue' | 'orange';
  gameState.boardSize = parseInt(size ?? '16');
  document.body.dataset.theme = gameState.theme;
}

/**
 * @description Sets up the event listener for the start button on the settings screen to save the selected settings to the game state and navigate to the game screen when clicked.
 */
function setupStartButton(): void {
  document.getElementById('btn-start')?.addEventListener('click', () => {
    saveSettingsToState();
    showGameScreen();
  });
}

/* ==========================================================================
   APP INITIALIZATION
   ========================================================================== */
/**
 * @description Initializes the user interface by displaying the home screen.
 * @export
 */
export function initUI(): void {
  showHomeScreen();
}
