# Chess

A browser-based chess game built from scratch with React and TypeScript. Play a full two-player game on a single screen — select pieces, see legal moves highlighted, and capture opponents with enforced turn order.

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

## Features

- **Interactive chessboard** — 8×8 grid with piece sprites and alternating light/dark squares
- **Full piece movement** — all six piece types (Pawn, Rook, Knight, Bishop, Queen, King) with their standard movement rules
- **Legal move highlighting** — click a piece to see available moves and capturable squares
- **Turn enforcement** — alternating white/black turns with visual feedback
- **Capture mechanics** — opponent pieces are highlighted as capturable targets
- **Object-oriented game logic** — each piece type is its own TypeScript class with encapsulated movement rules

## Tech Stack

| Layer       | Technology               |
|-------------|--------------------------|
| Language    | TypeScript 5.9           |
| UI          | React 19                 |
| Bundler     | Vite 8                   |
| Linting     | ESLint 9 + TypeScript ESLint |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm

### Installation

```bash
git clone <repo-url>
cd chess
npm install
```

### Development

```bash
npm run dev
```

Opens the app at [http://localhost:5173](http://localhost:5173) with hot module replacement.

### Production Build

```bash
npm run build
```

Compiles TypeScript and outputs optimized static files to `dist/`.

### Preview Build

```bash
npm run preview
```

Serves the production build locally for testing.

### Lint

```bash
npm run lint
```

## Project Structure

```
chess/
├── public/                     # Static assets (favicon, icons)
├── src/
│   ├── assets/                 # Piece sprite PNGs and move indicator
│   ├── components/
│   │   ├── Board/
│   │   │   ├── BoardComponent.tsx   # Main board UI and game loop
│   │   │   ├── Board.module.css     # Board and cell styling
│   │   │   └── utils.ts            # Cell data mapping helpers
│   │   ├── class/
│   │   │   ├── chessBoard/
│   │   │   │   └── ChessBoard.ts   # Singleton board state and move orchestration
│   │   │   ├── chessPieces/
│   │   │   │   ├── Pawn.ts         # Pawn movement and capture logic
│   │   │   │   ├── Rook.ts         # Orthogonal ray movement
│   │   │   │   ├── Knight.ts       # L-shaped movement
│   │   │   │   ├── Bishop.ts       # Diagonal ray movement
│   │   │   │   ├── Queen.ts        # Combined rook + bishop movement
│   │   │   │   └── King.ts         # Single-square movement
│   │   │   └── types.ts            # Shared interfaces and type definitions
│   │   └── constants.ts            # Board dimensions and initial piece layout
│   ├── customHook/
│   │   └── useModifier.ts          # BEM class name utility hook
│   ├── App.tsx                     # Root component
│   └── main.tsx                    # React entry point
├── index.html                      # HTML shell
├── package.json
├── tsconfig.json
├── vite.config.ts
└── eslint.config.js
```

## Architecture

The game logic follows a **singleton board + strategy-per-piece** pattern:

- **`ChessBoard`** is a singleton that owns the 8×8 grid of `IChessCell` objects. It handles selection state, move/capture execution, and dispatches move calculation to the appropriate piece class.
- **Each piece class** (`Pawn`, `Rook`, `Knight`, `Bishop`, `Queen`, `King`) implements its own move generation logic, marking valid destination cells as highlighted or capturable on the shared board.
- **`BoardComponent`** is the React layer that renders the board, manages turn state, and triggers re-renders after each move by calling `ChessBoard.performCalculation()`.

## How to Play

1. **White moves first** — click any white piece to select it
2. **Legal moves appear** — empty destination squares show a dot indicator; capturable enemy pieces are highlighted in red
3. **Click a destination** to move or capture
4. **Turns alternate** — after each move, control switches to the other color
5. Play continues on a single screen (no AI opponent — two human players)

## License

This project is unlicensed. Feel free to use it for learning and experimentation.

Game Picture
<img width="904" height="900" alt="image" src="https://github.com/user-attachments/assets/f6301352-abc8-4737-9e82-ccb0344bba1b" />
