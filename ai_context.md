# AI Context: RPG Tabletop Project (Survival UI)

## 1. Project Overview
**Name**: RPG Float UI (Survival Theme)
**Type**: Single Page Application (SPA)
**Theme**: Zombie/Apocalyptic Survival (Gritty, Dark, Red/Stone colors)
**Current State**: Frontend-only with sophisticated Mock services simulating a Java Spring Boot backend.
**Goal**: Provide an immersive, animated UI for a tabletop RPG, eventually connecting to a real Java/Spring backend.

## 2. Technology Stack

### Core
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Language**: TypeScript

### Styling & Animation
- **TailwindCSS**: Utility-first styling.
- **Framer Motion**: Complex animations (page transitions, sidebar slides, floating buttons).
- **Lucide React**: Iconography.
- **Assets**: `assets` folder + external highly-optimized SVG/gradients (e.g., Grainy Gradients).

### State Management (Zustand)
- **Store Architecture**: Split into domain-specific stores.
- **Persistence**: `zustand/middleware/persist` used to save state to `localStorage`.

## 3. Architecture "Under the Hood"

### Authentication & Security (Mock Layout)
The project simulates a secure enterprise environment to prepare for Java Spring integration.
- **Service**: `src/services/authService.ts`
- **Mechanism**:
  - Simulates latency (1.5s).
  - Returns **JWT-like tokens** and expired times.
  - **DTOs**: Matches Java Spring structure (`AuthResponse`, `User`, `AuthError`).
  - **Rules**: Enforces password length > 3.
  - **Guest Mode**: Allows anonymous login with negative IDs.

### Routing System
**Custom Implementation** in `App.tsx`.
- Does **not** use `react-router-dom`.
- Uses a `pageRegistry` object to map string IDs to Lazy-loaded components.
- **Lazy Loading**: Pages (`InventoryPage`, `MissionsPage`, etc.) are split into separate chunks.
- **Navigation**: Controlled by `layoutStore.activePageId`.

### Firebase Infrastructure
- **Hosting**: Deployed to `https://rpgprimeiroentrenos.web.app`.
- **Config**: `dist` folder as public root. SPA rewrites enabled.
- **Storage**:
  - **Rules (`storage.rules`)**: Public read, Authenticated write.
  - **Context**: Documented in `PROJECT_STATUS.md`.

## 4. Component Hierarchy ("Above the Hood")

### Root (`App.tsx`)
The entry point orchestrating the entire layout.
1.  **Dynamic Island**: Always visible top widget for status/notifications.
2.  **Home View**:
    - **Header**: "SURVIVAL UI" branding.
    - **Floating Buttons**: Draggable interactions for navigation.
3.  **Sub-Page View** (Split Layout):
    - **Left Sidebar**: `HumanBodyZone` (Character health/status) - Hidden on mobile.
    - **Main Content**: Glassmorphism container loading lazy pages.
    - **QuestBoardWidget**: Overlay for quest tracking.

### Key Directories
- `src/components`: UI atoms and widgets (FloatingButton, HumanBodyZone).
- `src/pages`: Full screen views (Inventory, Map, Settings).
- `src/store`: Logic centers (`authStore`, `layoutStore`, `questStore`).

## 5. Development Roadmap (AI Guidance)

### Current Focus
- **Polishing UI**: Animations, transitions, and "game-feel".
- **Mock Stability**: Ensuring mocks behave exactly like the future real API.

### Future Migration (Java Spring)
- **Do NOT** add Firebase Auth or Firestore Database logic (keep it mock only).
- **Interface Strictness**: Keep TypeScript interfaces strict to match future Java DTOs.
- **Endpoint mapping**:
  - `POST /api/auth/login` (Already mocked)

## 6. How to Run & Deploy
- **Dev Server**: `npm run dev` handles local SSL via `@vitejs/plugin-basic-ssl`.
- **Build**: `npm run build` (TypeScript check + Vite build).
- **Deploy**: `firebase deploy` (Handles Hosting & Storage rules).
