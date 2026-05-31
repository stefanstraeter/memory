
/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */

const btnPlay = document.getElementById('btnPlay') as HTMLButtonElement;

/* ==========================================================================
   INITIALIZATION 
   ========================================================================== */
/**
 * @description Initialize the UI by showing the home screen
 * @export
 */
export function initUI(): void {
  showScreen('screen-home');
  btnPlay?.addEventListener('click', () => showScreen('screen-settings'));
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

