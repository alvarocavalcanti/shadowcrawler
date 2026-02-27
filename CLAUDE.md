# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shadow Crawler is an Owlbear Rodeo extension for running the Crawling phase of the Shadowdark RPG. It's a React-based popover plugin that provides tools for GMs to track torch timers, crawling turns, and random encounters during dungeon crawling sessions.

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (runs on localhost with CORS enabled)
npm run dev

# Type check TypeScript files (no build output)
tsc --noEmit

# Build for production (compiles TypeScript and builds with Vite)
npm run build

# Preview production build
npm run preview
```

## Architecture

### Dual-Mode Application

The app has two distinct entry modes controlled by URL parameters:

- **Plugin Mode**: When `?obrref` is present in URL, renders the full plugin wrapped in `<PluginGate>` that waits for Owlbear Rodeo SDK to be ready
- **Homepage Mode**: Without `?obrref`, renders a static homepage for marketing/info purposes

Entry point: `src/main.tsx:14-24`

### Owlbear Rodeo Integration

The app uses `@owlbear-rodeo/sdk` for integration with Owlbear Rodeo:

- **Scene Ready Check**: App waits for OBR scene to be ready before rendering main UI (`src/components/App.tsx:11-12`)
- **Player Roles**: Detects if user is GM or PLAYER and renders different views accordingly (`src/components/SPA.tsx:17-19,37-38`)
- **Broadcast Messages**: Uses OBR's broadcast system for real-time sync between GM and players (countdown, torch turns, visibility state)
- **Theme Sync**: Automatically syncs with OBR's light/dark theme (`src/components/SPA.tsx:31-36`)

Message channels used (all prefixed with plugin ID):

- `${ID}-countdown`: Current countdown value
- `${ID}-mode`: Timer mode (1h vs 10 turns)
- `${ID}-torchTurn`: Current torch turn number
- `${ID}-show-to-players`: Visibility toggle

### Component Structure

- **Main.tsx**: Core GM interface with torch timer, crawling turns counter, and random encounter roller. Manages all game state and broadcasts to players
- **PlayerView.tsx**: Simple view shown to players when GM hasn't enabled "show to players"
- **SPA.tsx**: Router setup, role detection, and theme management
- **PluginGate.tsx**: Wrapper that ensures OBR SDK is ready before rendering children
- **Homepage.tsx**: Standalone landing page (non-plugin mode)

### State Management

The app uses local component state (React hooks) with localStorage persistence:

- State is saved to localStorage on every change (`src/components/Main.tsx:141-152`)
- State is loaded from localStorage on mount (`src/components/Main.tsx:154-166`)
- State includes: mode, countdown, torchTurn, crawlingTurns, showToPlayers, randomEncounterRoll, randomEncounterTurn

No global state management library is used. State is synchronized between GM and players via OBR broadcast messages.

### TypeScript Configuration

- Target: ES2020
- Strict mode enabled with additional linting rules (noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch)
- Module resolution: bundler mode
- JSX: react-jsx (React 17+ transform)
- Always run type checking after editing TypeScript files: `tsc --noEmit`

### Styling

- Uses Tailwind CSS v4 with utility classes and `dark:` variants
- Inline SVG icons
- Theme (light/dark) controlled by Owlbear Rodeo, toggling `dark` class on `<html>` element

### Manifest

Extension metadata lives in `public/manifest.json` and defines:

- Plugin name, version, description
- Icon and homepage URL
- Popover dimensions (600px height, 400px width)

### Version Management

Version is managed in two places and must be kept in sync:

- `package.json` (version field)
- `public/manifest.json` (version field)

The project uses date-based versioning (YYYY-MM-DD format).
