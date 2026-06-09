# MEMORY

A modern, theme-switchable Memory game built with TypeScript, Vite, and modular SCSS architecture.

Configure your match (theme, starting player, board size), play in a responsive card grid, and finish with a two-step end flow (Game Over -> Winner/Draw).

🔗 **Repository:** https://stefanstraeter.github.io/memory/

---

## Features

- Multi-screen game flow: Home, Settings, Game, Game Over, Winner, Draw
- Two visual themes: **Code Vibes** and **Gaming**
- Theme-aware icons and end-screen button labels
- Configurable board sizes: **16 / 24 / 36 cards**
- Starting player selection (Blue/Orange)
- Match scoring and active-player switching
- Exit confirmation modal during gameplay
- Responsive layout and mobile-friendly interactions
- Clean module split for game logic, view rendering, and UI setup

---

## Purpose

This project was developed as part of a frontend training module.

It demonstrates how to build a maintainable browser game with:

- TypeScript-based state and logic
- feature-oriented module boundaries
- scalable SCSS structure with page/component separation
- dynamic theming and screen-driven UI flow

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/stefanstraeter/memory.git
cd memory
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

---

## Tech Stack

- HTML5
- TypeScript
- SCSS (modular architecture)
- Vite

---

## Project Structure

```text
src/
  game/
    helpers.ts
    view.ts
  templates/
    gameTemplates.ts
  ui/
    dom.ts
    theme.ts
  styles/
    abstracts/
    base/
    components/
    pages/
    themes/
    main.scss
  game.ts
  main.ts
  state.ts
  ui.ts
public/
  fonts/
  img/
```

- **src/game** - Core game helpers and game-specific rendering/updating
- **src/templates** - HTML template factories for header and cards
- **src/ui** - UI DOM references and theme synchronization utilities
- **src/styles** - Layered SCSS architecture (abstracts, base, components, pages, themes)
- **src/state.ts** - Central mutable game state
- **src/game.ts** - Gameplay orchestration and match flow

---

## Architecture Highlights

- **Separation of Concerns**
  Logic (`game.ts`) is separated from rendering (`game/view.ts`) and pure helpers (`game/helpers.ts`).

- **Screen-Based UI Routing**
  A lightweight `showScreen(...)` flow toggles active screens cleanly without external routing libraries.

- **Theme-Synced End Screens**
  End-screen assets and labels are synchronized to the active theme, including observer-based updates.

- **Reusable Template Functions**
  Header and card markup are generated through dedicated template factories.

---

## Main Screens

- **Home** - Entry point with play action
- **Settings** - Theme/player/board-size selection and live summary
- **Game** - Card grid, score tracking, current player indicator, exit modal
- **Game Over** - Final score reveal
- **Winner** - Winner presentation with theme-aware visuals
- **Draw** - Draw presentation with dedicated icon and action

---

## Author

**Stefan Straeter**

GitHub: https://github.com/stefanstraeter/
