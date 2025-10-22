# Qwen Code Project Overview

This repository contains a SvelteKit implementation of the Tower of Hanoi visualization based on a Product Requirements Document (PRD) written in Korean. The project demonstrates an interactive visualization of the classic Tower of Hanoi recursive algorithm.

## Directory Structure

The repository consists of two main directories:

```
.
├── docs/
│   └── PRD/
│       └── tower-of-hanoi-visualization.md
├── src/
│   └── routes/
│       ├── +layout.svelte
│       └── +page.svelte
├── App.svelte
├── package.json
├── svelte.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── README.md
├── QWEN.md
└── app.html
```

### docs/PRD/
Contains the original Product Requirements Document in Korean that outlines the requirements for the Tower of Hanoi visualization.

### Project Structure (Consolidated)
The Tower of Hanoi visualization has been consolidated into fewer files for simplicity:
- `App.svelte` - Main application component containing all functionality (algorithm, UI, styling)
- `src/routes/+page.svelte` - Main page that renders the App component
- `src/routes/+layout.svelte` - Layout for the application
- Configuration files (package.json, svelte.config.js, etc.) for SvelteKit

## Tower of Hanoi Visualization Project

### Project Description
An interactive visualization of the Tower of Hanoi algorithm built with SvelteKit that helps users understand the recursive nature of this classic computer science puzzle.

### Features
- Visualizes the classic Tower of Hanoi puzzle with animated disk movements
- Adjustable number of disks (3-10)
- Play, pause, and step controls for the algorithm visualization
- Speed control for animation
- Statistics display showing current step, total steps, and algorithm complexity
- Responsive design that works on desktop and mobile devices

### Technical Stack
- **Framework**: SvelteKit
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS with responsive design

### Building and Running

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to [http://localhost:3000](http://localhost:3000)

### Building for Production

To build the application for production:

```bash
npm run build
```

This will create a production-ready build in the `.svelte-kit/output` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

### Algorithm Implementation

The Tower of Hanoi algorithm is implemented recursively in the App.svelte component:

```typescript
const calculateMoves = (n: number, source: number, target: number, auxiliary: number): Move[] => {
  if (n === 1) {
    return [{ from: source, to: target }];
  }

  const moves: Move[] = [];
  moves.push(...calculateMoves(n - 1, source, auxiliary, target));
  moves.push({ from: source, to: target });
  moves.push(...calculateMoves(n - 1, auxiliary, target, source));

  return moves;
};
```

This implementation correctly solves the Tower of Hanoi puzzle by:
1. Moving the top n-1 disks from the source to the auxiliary rod
2. Moving the largest disk from the source to the target rod
3. Moving the n-1 disks from auxiliary to the target rod

The minimum number of moves required is 2^n - 1, where n is the number of disks.

### Key Development Conventions
- TypeScript is used throughout for type safety
- Svelte components follow a naming convention with PascalCase
- CSS is scoped to components using Svelte's style scoping
- The project follows SvelteKit best practices for routing and layout
- All functionality has been consolidated into a single App.svelte file for simplicity