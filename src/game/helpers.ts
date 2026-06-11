// src/game/helpers.ts
import { gameState } from '../state';
import { assetPath } from '../assets';
import type { Player, Winner } from '../types';

/* ==========================================================================
   1. PURE LOGIC & DATA HELPERS (Kein DOM, reine Berechnung)
   ========================================================================== */

/**
 * Ermittelt rein mathematisch den Gewinner anhand der Punktestände.
 */
export function getWinner(): Winner {
  if (gameState.scores.blue > gameState.scores.orange) return 'blue';
  if (gameState.scores.orange > gameState.scores.blue) return 'orange';
  return 'draw';
}

/**
 * Übersetzt den Player-Key in einen sauberen Anzeige-String.
 */
export function getWinnerLabel(winner: Exclude<Winner, 'draw'>): string {
  return winner === 'blue' ? 'BLUE PLAYER' : 'ORANGE PLAYER';
}

/**
 * Kombiniert Werte paarweise und mischt sie mit dem Fisher-Yates-Algorithmus.
 */
export function createCardValues(boardSize: number): number[] {
  const numberOfPairs = boardSize / 2;
  const uniqueValues: number[] = [];

  for (let i = 1; i <= numberOfPairs; i++) {
    uniqueValues.push(i);
  }

  const deck = [...uniqueValues, ...uniqueValues];

  return shuffle(deck);
}

/**
 * Reine Hilfsfunktion zum Mischen eines Arrays (In-place).
 */
function shuffle(array: number[]): number[] {
  const arr = [...array];  
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ==========================================================================
   2. UI & ASSET HELPERS (Zuständig für Pfade und Themes)
   ========================================================================== */

/**
 * Gibt den passenden Ordnernamen für das gewählte Theme zurück.
 */
export function getThemeFolder(): string {
  return gameState.theme === 'gaming' ? 'game_theme' : 'vibes_theme';
}

/**
 * Holt das Icon für die Live-Anzeige im Header während des Spiels.
 */
export function getPlayerIcon(player: Player): string {
  if (gameState.theme === 'gaming') {
    return assetPath(`/img/00_general/chess_${player}.png`);
  }
  return assetPath(`/img/00_general/label_${player}.svg`);
}

/**
 * Holt das spezifische Gewinner-Icon für den Endscreen.
 */
export function getWinnerIcon(player: Player): string {
  const activeTheme = document.body.dataset.theme;
  if (activeTheme === 'gaming') {
    return assetPath('/img/00_general/draw_icon_game.png');
  }
  return assetPath(`/img/00_general/chess_${player}.png`);
}

/**
 * Holt das Icon für das Unentschieden-Szenario.
 */
export function getDrawIcon(): string {
  const activeTheme = document.body.dataset.theme;
  return activeTheme === 'gaming'
    ? assetPath('/img/00_general/draw_icon_game.png')
    : assetPath('/img/00_general/draw_icon_code.png');
}