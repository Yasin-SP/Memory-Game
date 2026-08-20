# 🧠 Memory Quest

A fast, playful memory-matching card game built with React + Vite. Pick a difficulty, flip cards, chain combos, and beat your best score.

**[▶ Live Demo](#)** ← replace with your deployed link

![Memory Quest screenshot](./public/og-image.png)

## Features

- 🎮 4 difficulty levels — Easy (3×4) up to Expert (4×6)
- 🔥 Combo scoring — consecutive matches build a streak multiplier
- ⏱ Live stats — timer, move count, mistakes, and score tracked in real time
- 🏅 Best score — saved per difficulty in `localStorage`
- 🔊 Lightweight sound effects — generated with the Web Audio API, no audio files
- 📱 Responsive layout — dedicated mobile breakpoints down to 350px
- ♿ Accessible — proper `aria-label`s and keyboard-focus styles on every card and button

## Tech stack

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- Plain CSS (no framework) — custom design system in `src/index.css` / `src/mobile.css`
- ESLint with `eslint-plugin-react-hooks`

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

### Other scripts

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build locally
npm run lint     # run ESLint
```

## Project structure

```
src/
├── App.jsx                  # top-level state: difficulty, start screen, layout
├── components/
│   ├── Card.jsx              # single flippable card
│   ├── GameHeader.jsx        # stats bar (time, moves, pairs, score)
│   └── WinMessage.jsx        # end-of-game summary overlay
├── hooks/
│   └── useGameLogic.js       # game state machine: flipping, matching, scoring
├── index.css                 # base styles
└── mobile.css                 # responsive breakpoints
```

## Deployment

This is a static Vite app, so it deploys to any static host. Example with Vercel:

```bash
npm i -g vercel
vercel
```

Or connect the GitHub repo directly in the [Vercel](https://vercel.com/) / [Netlify](https://netlify.com/) dashboard — build command `npm run build`, output directory `dist`.

## License

MIT — see [LICENSE](./LICENSE).
