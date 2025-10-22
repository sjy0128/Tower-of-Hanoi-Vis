# Tower of Hanoi Visualization

An interactive visualization of the Tower of Hanoi algorithm built with SvelteKit.

## Features

- Visualizes the classic Tower of Hanoi puzzle with animated disk movements
- Adjustable number of disks (3-10)
- Play, pause, and step controls for the algorithm visualization
- Speed control for animation
- Statistics display showing current step, total steps, and algorithm complexity
- Responsive design that works on desktop and mobile devices

## How the Algorithm Works

The Tower of Hanoi is a classic recursive algorithm puzzle with these rules:
1. Only one disk can be moved at a time
2. Each move consists of taking the upper disk from one of the stacks and placing it on top of another stack
3. No disk may be placed on top of a smaller disk

The minimum number of moves required is 2^n - 1, where n is the number of disks.

## Project Structure

```
tower-of-hanoi-vis/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── TowerOfHanoi.svelte   # Main visualization component
│   │   │   ├── Rod.svelte            # Rod component
│   │   │   ├── Disk.svelte           # Disk component
│   │   │   ├── Controls.svelte       # Control panel component
│   │   │   └── Stats.svelte          # Statistics panel component
│   │   └── types.ts                  # Type definitions
│   ├── routes/
│   │   ├── +layout.svelte            # Layout with global styles
│   │   └── +page.svelte              # Main page component
│   └── app.html                      # HTML template
├── static/
├── package.json
├── svelte.config.js
├── tsconfig.json
└── vite.config.ts
```

## Setup and Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to [http://localhost:3000](http://localhost:3000)

## Building for Production

To build the application for production:

```bash
npm run build
```

This will create a production-ready build in the `.svelte-kit/output` directory.

## Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## License

MIT# Tower-of-Hanoi-Vis
