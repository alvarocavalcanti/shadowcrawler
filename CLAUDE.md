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

There is no ESLint configured — "linting" for this project means running `tsc --noEmit`.

## Architecture

### Dual-Mode Application

The app has two distinct entry modes controlled by URL parameters:

- **Plugin Mode**: When `?obrref` is present in URL, renders the full plugin wrapped in `<PluginGate>` that waits for Owlbear Rodeo SDK to be ready
- **Homepage Mode**: Without `?obrref`, renders a static homepage for marketing/info purposes

Entry point: `src/main.tsx`

The plugin ID `"es.memorablenaton.shadowcrawler"` is exported as `ID` from `src/main.tsx` and imported by `Main.tsx` to prefix all OBR broadcast channel names.

### Owlbear Rodeo Integration

The app uses `@owlbear-rodeo/sdk` for integration with Owlbear Rodeo:

- **Scene Ready Check**: App waits for OBR scene to be ready before rendering main UI (`src/components/App.tsx`)
- **Player Roles**: Detects if user is GM or PLAYER and passes a `player` boolean prop to `Main.tsx`, which renders different views accordingly
- **Broadcast Messages**: Uses OBR's broadcast system for real-time sync between GM and players
- **Theme Sync**: OBR's light/dark theme is applied by toggling the `dark` class on `<html>` in `SPA.tsx`

OBR broadcast channels (all prefixed with `ID`):

- `${ID}-countdown`: Current countdown value in seconds
- `${ID}-mode`: Timer mode (`"1h"` vs `"10turns"`)
- `${ID}-torchTurn`: Current torch turn number
- `${ID}-show-to-players`: Visibility toggle boolean

### Routing

Uses `react-router-dom` v6. Routes are defined in `SPA.tsx` with `Navbar.tsx` as the layout wrapper (renders tabs + `<Outlet />`):

- `/` — `Main.tsx` (GM/player game interface)
- `/about` — `About.tsx` (theme selector, social links, version, donation buttons)

Route paths are defined in `src/components/util/constants.ts`.

### Component Structure

- **Main.tsx**: Core GM/player interface. Manages all game state, persists to localStorage, and broadcasts to players via OBR
- **SPA.tsx**: Sets up router, detects player role, syncs OBR theme to `dark` CSS class
- **Navbar.tsx**: Tab navigation (Main / About), renders the `WhatsNew` modal, shows dev mode banner
- **About.tsx**: Hosts `ThemeSelector`, social links, `DonationButtons`, and version display
- **ThemeSelector.tsx**: UI for switching between the 4 color palettes defined in `src/themes.ts`
- **WhatsNew.tsx**: Modal that shows release highlights when the version in `manifest.json` is newer than what's stored in localStorage
- **PluginGate.tsx**: Waits for OBR SDK to be ready before rendering children
- **OBRLoading.tsx**: Loading state shown while OBR initialises
- **SceneNotReady.tsx**: Shown when OBR scene is not yet ready
- **PlayerView.tsx**: Placeholder view shown to players when GM has not enabled "show to players"
- **Homepage.tsx**: Standalone landing page (non-plugin mode)

### State Management

The app uses local component state (React hooks) with localStorage persistence:

- State is saved to localStorage on every change and loaded on mount (`src/components/Main.tsx`)
- State includes: `mode`, `countdown`, `torchTurn`, `crawlingTurns`, `showToPlayers`, `randomEncounterRoll`, `randomEncounterTurn`

No global state management library is used. State is synchronised between GM and players via OBR broadcast messages.

localStorage keys used across the app:

- `shadowcrawlerState` — main game state (Main.tsx)
- `map-location-keys-theme` — user's selected color palette (useTheme.ts)
- `shadowcrawler-last-seen-version` — last version seen, drives WhatsNew modal (Navbar.tsx)

### Theming

Two independent layers:

1. **OBR color mode** (`light` / `dark`): controlled by Owlbear Rodeo. Applied by toggling the `dark` class on `<html>`, enabling Tailwind's `dark:` variants.
2. **Color palette**: 4 user-selectable themes defined in `src/themes.ts` (`dark-fantasy`, `modern-saas`, `gaming-vibrant`, `earthy-dungeon`). The active theme is applied as CSS custom properties (`--color-bg`, `--color-primary`, etc.) on `:root` by `src/hooks/useTheme.ts`. Components use these via Tailwind's `bg-[var(--color-bg)]` syntax or direct `style` props.

### Icons

Both inline SVG and FontAwesome icons (`@fortawesome/react-fontawesome`) are used across components.

### Analytics

`src/utils.ts` exposes an `analytics` object that wraps `window.gtag` calls. Events are tracked for timer interactions, mode changes, and other key actions. The function is a no-op when `gtag` is not available.

### Dev Mode

Setting `localStorage.setItem("dev-mode", "true")` in the browser console activates a yellow "Development Mode" banner rendered by `Navbar.tsx`. Useful for local testing without modifying code.

### Release Notes

`src/releaseNotes.ts` contains the `releaseHighlights` array shown in the `WhatsNew` modal. Add a new entry here when shipping a release.

### TypeScript Configuration

- Target: ES2020
- Strict mode enabled with additional linting rules (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`)
- Module resolution: bundler mode
- JSX: react-jsx (React 17+ transform)
- Always run `tsc --noEmit` after editing TypeScript files

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
