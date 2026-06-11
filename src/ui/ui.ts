// src/ui/ui.ts
import { gameState } from '../state';
import { initGame } from '../game/game';
import { assetPath } from '../assets';
import type { Theme } from '../types';
import { getActiveTheme, setupThemeSyncObserver, syncEndScreenTheme } from './theme';
import {
  createHomeScreenTemplate,
  createDrawScreenTemplate,
  createGameOverScreenTemplate,
  createGameScreenTemplate,
  createSettingsScreenTemplate,
  createWinnerScreenTemplate,
} from '../templates/screen-templates';

const themePreviews = {
  'code-vibes': assetPath('/img/01_themes/vibes_theme/vibe_theme.png'),
  'gaming': assetPath('/img/01_themes/game_theme/game_theme.png'),
};

/* ==========================================================================
   CORE RENDERING (DOM-CLEANING)
   ========================================================================== */

function renderScreen(htmlContent: string): void {
  const appRoot = document.getElementById('app');
  if (appRoot) {
    appRoot.innerHTML = htmlContent;
  }
}

/* ==========================================================================
   SCREEN NAVIGATION SIGNALS
   ========================================================================== */

export function showHomeScreen(): void {
  renderScreen(createHomeScreenTemplate());
  setupHomeListeners();
}

export function showSettingsScreen(): void {
  renderScreen(createSettingsScreenTemplate());
  setupSettingsListeners();
}

export function showGameScreen(): void {
  renderScreen(createGameScreenTemplate());
  initGame();
}

export function showGameOverScreen(): void {
  renderScreen(createGameOverScreenTemplate());
}

export function showWinnerScreen(): void {
  renderScreen(createWinnerScreenTemplate());
  setupEndScreenListeners();
}

export function showDrawScreen(): void {
  renderScreen(createDrawScreenTemplate());
  setupEndScreenListeners();
}

/* ==========================================================================
   EVENT LISTENERS (EINE AUFGABE PRO FUNKTION)
   ========================================================================== */

function setupHomeListeners(): void {
  document.getElementById('btnPlay')?.addEventListener('click', () => {
    showSettingsScreen();
  });
}

function setupEndScreenListeners(): void {
  const btn = document.getElementById('btn-back-to-start-winner') || document.getElementById('btn-back-to-start-draw');
  btn?.addEventListener('click', () => {
    document.body.dataset.theme = 'code-vibes';
    showHomeScreen();
  });
}

function setupSettingsListeners(): void {
  setupThemeRadios();
  setupPlayerRadios();
  setupBoardSizeRadios();
  setupStartButton();
}

/* ==========================================================================
   SETTINGS INPUT HANDLERS
   ========================================================================== */

function checkStartEnabled(): void {
  const btnStart = document.getElementById('btn-start') as HTMLButtonElement | null;
  const theme = document.querySelector('input[name="theme"]:checked');
  const player = document.querySelector('input[name="player"]:checked');
  const size = document.querySelector('input[name="board-size"]:checked');

  if (btnStart) {
    btnStart.disabled = !(theme && player && size);
  }
}

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

function saveSettingsToState(): void {
  const theme = document.querySelector<HTMLInputElement>('input[name="theme"]:checked')?.value;
  const player = document.querySelector<HTMLInputElement>('input[name="player"]:checked')?.value;
  const size = document.querySelector<HTMLInputElement>('input[name="board-size"]:checked')?.value;

  gameState.theme = (theme ?? 'code-vibes') as Theme;
  gameState.player = (player ?? 'blue') as 'blue' | 'orange';
  gameState.boardSize = parseInt(size ?? '16');
  document.body.dataset.theme = gameState.theme;
}

function setupStartButton(): void {
  document.getElementById('btn-start')?.addEventListener('click', () => {
    saveSettingsToState();
    showGameScreen();
  });
}

/* ==========================================================================
   APP APP INITIALIZATION
   ========================================================================== */

export function initUI(): void {
  showHomeScreen();
  syncEndScreenTheme(getActiveTheme());
  setupThemeSyncObserver();
}