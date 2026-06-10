/* ==========================================================================
  TYPES
  ========================================================================== */

export type Theme = 'code-vibes' | 'gaming';

export type Player = 'blue' | 'orange';

export type Winner = 'blue' | 'orange' | 'draw';

export type HeaderTemplateData = {
  showColorLabels: boolean;
  backButtonText: string;
  exitButtonText: string;
  blueIcon: string;
  orangeIcon: string;
  currentPlayerIcon: string;
  currentPlayerAlt: Player;
};

export type ExitModalElements = {
  exitBtn: HTMLButtonElement;
  modal: HTMLElement;
  backBtn: HTMLButtonElement;
  confirmBtn: HTMLButtonElement;
};
