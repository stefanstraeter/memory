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

function getActiveTheme(): 'code-vibes' | 'gaming' {
  return document.body.dataset.theme === 'gaming' ? 'gaming' : 'code-vibes';
}

function applyEndScreenButtonLabels(theme: 'code-vibes' | 'gaming'): void {
  const label = theme === 'gaming' ? 'home' : 'Back to start';
  const winnerButton = document.getElementById('btn-back-to-start-winner');
  const drawButton = document.getElementById('btn-back-to-start-draw');

  if (winnerButton) winnerButton.textContent = label;
  if (drawButton) drawButton.textContent = label;
}

function applyEndScreenThemeAssets(theme: 'code-vibes' | 'gaming'): void {
  const drawIcon = document.querySelector<HTMLImageElement>('.draw__icon');
  if (!drawIcon) return;

  drawIcon.src = theme === 'gaming' ? '/img/00_general/draw_icon_game.png' : '/img/00_general/draw_icon_code.png';
  drawIcon.alt = 'Draw icon';
}

function setupThemeSyncObserver(): void {
  const observer = new MutationObserver(() => {
    const activeTheme = getActiveTheme();
    applyEndScreenButtonLabels(activeTheme);
    applyEndScreenThemeAssets(activeTheme);
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
}

/* ==========================================================================
   SETUP FUNCTIONS
   ========================================================================== */

function setupNavigation(): void {
  btnPlay?.addEventListener('click', () => showScreen('screen-settings'));
}

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
      const nextTheme = radio.value === 'gaming' ? 'gaming' : 'code-vibes';
      applyEndScreenButtonLabels(nextTheme);
      applyEndScreenThemeAssets(nextTheme);
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
  const activeTheme = getActiveTheme();
  applyEndScreenButtonLabels(activeTheme);
  applyEndScreenThemeAssets(activeTheme);
  setupThemeSyncObserver();
  setupNavigation();
  setupWinnerScreen();
  setupThemeRadios();
  setupPlayerRadios();
  setupBoardSizeRadios();
}

export function showScreen(screenId: string): void {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('screen--active'));
  document.getElementById(screenId)?.classList.add('screen--active');

  const activeTheme = getActiveTheme();
  applyEndScreenButtonLabels(activeTheme);
  applyEndScreenThemeAssets(activeTheme);
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