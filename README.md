# Games Without A Purpose

A collection of creative, educational logic games built as static HTML pages. Each game teaches complex concepts through interactive puzzles with progressive difficulty.

## Philosophy

These aren't simple sudoku clones. Each game explores unique mechanics and educational concepts through carefully crafted puzzles that build understanding incrementally.

## Games

### 🌀 Quantum Tiles
Learn how quantum mechanics works through interactive tile puzzles. Topics covered:
- **Superposition**: Quantum systems existing in multiple states simultaneously
- **Wave Function Collapse**: How measurement forces quantum systems into definite states
- **Entanglement**: Correlations between quantum particles that persist across distance

Each topic includes:
- 1 tutorial level with explanations
- 4 practice levels of increasing complexity

## Project Structure

```
games/              # Individual game directories
shared/             # Shared utilities and components
assets/             # Shared assets (icons, fonts)
index.html          # Landing page
```

## Technology Stack

- **Framework**: Vue 3 (via CDN)
- **Rendering**: HTML5 Canvas for quantum state visualization
- **Storage**: LocalStorage for progress tracking
- **Styling**: Pure CSS with CSS Grid and Flexbox

## Playing the Games

All games are fully client-side and require no server. Simply open `index.html` in a modern browser or visit the hosted version.

## Development

Each game is self-contained in its own directory under `games/`. Shared utilities are in `shared/` for common functionality like:
- Level progression tracking
- Tutorial system
- Common UI components

## License

MIT License - Feel free to learn, modify, and share!
