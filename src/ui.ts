
/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */

const btnPlay = document.getElementById('btnPlay') as HTMLButtonElement;
const btnStart = document.getElementById('btn-start') as HTMLButtonElement;
const themePreview = document.getElementById('theme-preview') as HTMLImageElement;
const selectedThemeLabel = document.getElementById('selected-theme') as HTMLSpanElement;
const selectedPlayerLabel = document.getElementById('selected-player') as HTMLSpanElement;
const selectedSizeLabel = document.getElementById('selected-size') as HTMLSpanElement;

const themePreviews: Record<string, string> = {
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
  btnStart?.addEventListener('click', () => showScreen('screen-game'));
}

function setupThemeRadios(): void {
  document.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (themePreview) themePreview.src = themePreviews[radio.value] ?? themePreviews['code-vibes'];
      if (selectedThemeLabel) selectedThemeLabel.textContent = radio.closest('label')?.textContent?.trim() ?? 'Game theme';
      document.body.dataset.theme = radio.value === 'gaming' ? 'gaming' : 'code-vibes';
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
  setupThemeRadios();
  setupPlayerRadios();
  setupBoardSizeRadios();
}


/**
 * @description Show the specified screen and hide all others
 * @export
 * @param {string} screenId - The ID of the screen to show
 */
export function showScreen(screenId: string): void {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('screen--active'));
  document.getElementById(screenId)?.classList.add('screen--active');
}

