import { assetPath } from '../assets';



export function createHomeScreenTemplate(): string {
  return `
    <section id="screen-home" class="screen home">
      <div class="home__content">
        <span class="home__subtitle">It's time to play</span>
        <h1 class="home__title">Ready to play?</h1>

        <div class="home__actions">
          <button id="btnPlay" class="btn btn--primary btn--large">
            <img src="${assetPath('/img/00_general/stadia_controller.png')}" class="btn__icon" alt="Stadia Controller" />
            Play
            <span class="btn__arrow"></span>
          </button>
        </div>
      </div>
      <img src="${assetPath('/img/00_general/stadia_controller_yellow.png')}" class="home__controller" alt="Yellow Stadia Controller" />
    </section>
  `;
}


/**
 * Creates settings screen markup for lazy mounting.
 */
export function createSettingsScreenTemplate(): string {
  return `
    <section id="screen-settings" class="screen settings">
      <h2 class="settings__title">Settings</h2>
      <div class="settings__divider"></div>

      <div class="settings__content">
        <div class="settings__left">
          <fieldset class="settings__fieldset">
            <legend class="settings__legend">
              <img src="${assetPath('/img/00_general/palette.svg')}" alt="" />
              Game themes
            </legend>
            <label class="settings__label">
              <input type="radio" name="theme" value="code-vibes" />
              Code vibes
              <span class="label__indicator"></span>
            </label>
            <label class="settings__label">
              <input type="radio" name="theme" value="gaming" />
              Gaming
              <span class="label__indicator"></span>
            </label>
          </fieldset>

          <fieldset class="settings__fieldset">
            <legend class="settings__legend">
              <img src="${assetPath('/img/00_general/chess_pawn.svg')}" alt="" />
              Choose player
            </legend>
            <label class="settings__label">
              <input type="radio" name="player" value="blue" />
              Blue
              <span class="label__indicator"></span>
            </label>
            <label class="settings__label">
              <input type="radio" name="player" value="orange" />
              Orange
              <span class="label__indicator"></span>
            </label>
          </fieldset>

          <fieldset class="settings__fieldset">
            <legend class="settings__legend">
              <img src="${assetPath('/img/00_general/style.svg')}" alt="" />
              Board size
            </legend>
            <label class="settings__label">
              <input type="radio" name="board-size" value="16" />
              16 cards
              <span class="label__indicator"></span>
            </label>
            <label class="settings__label">
              <input type="radio" name="board-size" value="24" />
              24 cards
              <span class="label__indicator"></span>
            </label>
            <label class="settings__label">
              <input type="radio" name="board-size" value="36" />
              36 cards
              <span class="label__indicator"></span>
            </label>
          </fieldset>
        </div>

        <div class="settings__right">
          <img
            id="theme-preview"
            class="settings__preview-img"
            src="${assetPath('/img/01_themes/vibes_theme/vibe_theme.png')}"
            alt="Theme preview"
          />

          <div class="settings__bar">
            <span id="selected-theme" class="settings__bar-item">Game theme</span>
            <span class="settings__bar-divider">/</span>
            <span id="selected-player" class="settings__bar-item">Player</span>
            <span class="settings__bar-divider">/</span>
            <span id="selected-size" class="settings__bar-item">Board size</span>
            <button id="btn-start" class="btn btn--primary settings__bar-btn" disabled>
              <img src="${assetPath('/img/00_general/smart_display.svg')}" class="btn__icon" alt="" />
              Start
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * Creates gameplay screen markup for lazy mounting.
 */
export function createGameScreenTemplate(): string {
  return `
    <section id="screen-game" class="screen game">
      <header class="game__header"></header>
      <div class="game__board">
        <div id="memory-grid" class="game-board__grid"></div>
      </div>
    </section>
  `;
}

/**
 * Creates game-over screen markup for lazy mounting.
 */
export function createGameOverScreenTemplate(): string {
  return `
    <section id="screen-gameover" class="screen gameover">
      <div class="gameover__content">
        <h2 class="gameover__title">GAME OVER</h2>
        <p class="gameover__subtitle">Final score</p>
        <div class="gameover__scores status__scores">
          <span class="score score--blue">
            <img id="gameover-blue-icon" class="score__icon" src="${assetPath('/img/00_general/label_blue.svg')}" alt="" />
            <span id="gameover-blue-label">Blue </span><span id="gameover-blue-score" class="score__value">0</span>
          </span>
          <span class="score score--orange">
            <img id="gameover-orange-icon" class="score__icon" src="${assetPath('/img/00_general/label_orange.svg')}" alt="" />
            <span id="gameover-orange-label">Orange </span><span id="gameover-orange-score" class="score__value">0</span>
          </span>
        </div>
      </div>
    </section>
  `;
}

/**
 * Creates winner screen markup for lazy mounting.
 */
export function createWinnerScreenTemplate(): string {
  return `
    <section id="screen-winner" class="screen winner">
      <div class="winner__content">
        <img class="winner__header-icon" src="${assetPath('/img/00_general/confetti.png')}" alt="" />
        <h2 class="winner__title">The winner is</h2>
        <div class="winner__winner" data-winner="blue">
          <p id="winner-name" class="winner__winner-name">Blue Player</p>
          <img id="winner-icon" class="winner__winner-icon" src="${assetPath('/img/00_general/pockal.png')}" alt="Winner trophy" />
        </div>
        <button id="btn-back-to-start-winner" class="btn btn--exit winner__back-btn" type="button">Back to start</button>
      </div>
    </section>
  `;
}

/**
 * Creates draw screen markup for lazy mounting.
 */
export function createDrawScreenTemplate(): string {
  return `
    <section id="screen-draw" class="screen draw">
      <div class="draw__content">
        <h2 class="draw__title">It's a</h2>
        <p class="draw__name">DRAW</p>
        <img class="draw__icon" src="${assetPath('/img/00_general/draw_icon_code.png')}" alt="Draw" />
        <button id="btn-back-to-start-draw" class="btn btn--exit draw__back-btn" type="button">Back to start</button>
      </div>
    </section>
  `;
}
