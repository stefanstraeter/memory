/* ==========================================================================
  TYPES
  ========================================================================== */

type Player = 'blue' | 'orange';

type HeaderTemplateData = {
  showColorLabels: boolean;
  backButtonText: string;
  exitButtonText: string;
  blueIcon: string;
  orangeIcon: string;
  currentPlayerIcon: string;
  currentPlayerAlt: Player;
};

  /* ==========================================================================
    TEMPLATE FACTORIES
    ========================================================================== */

  /**
   * Creates the game header and embedded exit modal markup.
   *
   * @param data - Template values for icons, labels, and button text.
   * @returns Header HTML string.
   */
export function createHeaderTemplate(data: HeaderTemplateData): string {
  const {
    showColorLabels,
    backButtonText,
    exitButtonText,
    blueIcon,
    orangeIcon,
    currentPlayerIcon,
    currentPlayerAlt,
  } = data;

  return `
    <div class="game__status">
      <div class="status__scores">
        <span class="score score--blue">
          <img class="score__icon" src="${blueIcon}" alt="">
          ${showColorLabels ? 'Blue ' : ''}<span class="score__value">0</span>
        </span>
        <span class="score score--orange">
          <img class="score__icon" src="${orangeIcon}" alt="">
          ${showColorLabels ? 'Orange ' : ''}<span class="score__value">0</span>
        </span>
      </div>
      <div class="status__current">
        Current player:
        <img class="current-indicator" src="${currentPlayerIcon}" alt="${currentPlayerAlt}">
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

/**
 * Creates a single memory card template.
 *
 * @param cardValue - Card face id.
 * @param themeFolder - Theme asset folder name.
 * @returns Card HTML string.
 */
export function createCardTemplate(cardValue: number, themeFolder: string): string {
  return `
    <div class="card__inner">
      <div class="card__front">
        <img src="/img/01_themes/${themeFolder}/cards/card_background.png" alt="">
      </div>
      <div class="card__back">
        <img src="/img/01_themes/${themeFolder}/cards/card${cardValue}.png" alt="Card ${cardValue}">
      </div>
    </div>
  `;
}
