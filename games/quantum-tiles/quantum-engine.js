// Quantum mechanics simulation engine

export class QuantumState {
  constructor(numStates = 2) {
    // Quantum state represented as probability amplitudes
    // For simplicity, we use probability distribution instead of complex amplitudes
    this.numStates = numStates;
    this.probabilities = new Array(numStates).fill(1 / numStates);
    this.isCollapsed = false;
    this.collapsedState = null;
  }

  // Create a state with specific probabilities
  static fromProbabilities(probs) {
    const state = new QuantumState(probs.length);
    state.probabilities = [...probs];
    state.normalize();
    return state;
  }

  // Create a collapsed (definite) state
  static collapsed(stateIndex, numStates = 2) {
    const state = new QuantumState(numStates);
    state.collapse(stateIndex);
    return state;
  }

  // Normalize probabilities to sum to 1
  normalize() {
    const sum = this.probabilities.reduce((a, b) => a + b, 0);
    if (sum > 0) {
      this.probabilities = this.probabilities.map(p => p / sum);
    }
  }

  // Measure/collapse the quantum state
  collapse(forcedState = null) {
    if (this.isCollapsed) {
      return this.collapsedState;
    }

    let state;
    if (forcedState !== null) {
      state = forcedState;
    } else {
      // Probabilistic collapse based on probabilities
      const rand = Math.random();
      let cumulative = 0;
      for (let i = 0; i < this.numStates; i++) {
        cumulative += this.probabilities[i];
        if (rand < cumulative) {
          state = i;
          break;
        }
      }
      // Fallback
      if (state === undefined) {
        state = this.numStates - 1;
      }
    }

    this.isCollapsed = true;
    this.collapsedState = state;
    this.probabilities = new Array(this.numStates).fill(0);
    this.probabilities[state] = 1.0;

    return state;
  }

  // Get the dominant state (highest probability)
  getDominantState() {
    if (this.isCollapsed) {
      return this.collapsedState;
    }
    return this.probabilities.indexOf(Math.max(...this.probabilities));
  }

  // Check if state is in superposition
  isInSuperposition() {
    if (this.isCollapsed) {
      return false;
    }
    // In superposition if more than one state has non-negligible probability
    const significant = this.probabilities.filter(p => p > 0.01).length;
    return significant > 1;
  }

  // Clone the state
  clone() {
    const state = new QuantumState(this.numStates);
    state.probabilities = [...this.probabilities];
    state.isCollapsed = this.isCollapsed;
    state.collapsedState = this.collapsedState;
    return state;
  }
}

export class QuantumTile {
  constructor(row, col, state = null) {
    this.row = row;
    this.col = col;
    this.state = state || new QuantumState(2);
    this.entangledWith = []; // Array of {tile, type} where type is 'same' or 'opposite'
  }

  measure() {
    const result = this.state.collapse();

    // Cascade collapse to entangled tiles
    this.entangledWith.forEach(({ tile, type }) => {
      if (!tile.state.isCollapsed) {
        if (type === 'same') {
          tile.state.collapse(result);
        } else if (type === 'opposite') {
          tile.state.collapse(1 - result);
        }
        // Recursive cascade
        tile.cascadeEntanglement();
      }
    });

    return result;
  }

  cascadeEntanglement() {
    this.entangledWith.forEach(({ tile, type }) => {
      if (!tile.state.isCollapsed) {
        if (type === 'same') {
          tile.state.collapse(this.state.collapsedState);
        } else if (type === 'opposite') {
          tile.state.collapse(1 - this.state.collapsedState);
        }
        tile.cascadeEntanglement();
      }
    });
  }

  entangleWith(otherTile, type = 'same') {
    // Avoid duplicate entanglement
    if (!this.entangledWith.find(e => e.tile === otherTile)) {
      this.entangledWith.push({ tile: otherTile, type });
    }
    if (!otherTile.entangledWith.find(e => e.tile === this)) {
      otherTile.entangledWith.push({ tile: this, type });
    }
  }

  clone() {
    const tile = new QuantumTile(this.row, this.col, this.state.clone());
    // Note: entanglement links are not cloned (would need special handling)
    return tile;
  }
}

export class QuantumGrid {
  constructor(rows, cols, numStates = 2) {
    this.rows = rows;
    this.cols = cols;
    this.numStates = numStates;
    this.tiles = [];

    // Initialize grid
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        row.push(new QuantumTile(r, c, new QuantumState(numStates)));
      }
      this.tiles.push(row);
    }
  }

  getTile(row, col) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      return this.tiles[row][col];
    }
    return null;
  }

  measureTile(row, col) {
    const tile = this.getTile(row, col);
    if (tile && !tile.state.isCollapsed) {
      return tile.measure();
    }
    return tile ? tile.state.collapsedState : null;
  }

  // Apply interference effect (neighboring superpositions affect probabilities)
  applyInterference(row, col) {
    const tile = this.getTile(row, col);
    if (!tile || tile.state.isCollapsed) {
      return;
    }

    const neighbors = this.getNeighbors(row, col);
    const superposedNeighbors = neighbors.filter(n => n.state.isInSuperposition());

    if (superposedNeighbors.length === 0) {
      return;
    }

    // Calculate interference effect
    // Neighbors in superposition increase probability of similar states (constructive interference)
    const newProbs = [...tile.state.probabilities];

    superposedNeighbors.forEach(neighbor => {
      for (let i = 0; i < this.numStates; i++) {
        // Constructive interference: amplify probabilities that neighbors also have
        newProbs[i] += neighbor.state.probabilities[i] * 0.1;
      }
    });

    tile.state.probabilities = newProbs;
    tile.state.normalize();
  }

  getNeighbors(row, col, includeDiagonal = false) {
    const neighbors = [];
    const directions = includeDiagonal
      ? [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]]
      : [[-1,0], [0,-1], [0,1], [1,0]];

    directions.forEach(([dr, dc]) => {
      const tile = this.getTile(row + dr, col + dc);
      if (tile) {
        neighbors.push(tile);
      }
    });

    return neighbors;
  }

  // Setup entanglement between tiles
  createEntanglement(row1, col1, row2, col2, type = 'same') {
    const tile1 = this.getTile(row1, col1);
    const tile2 = this.getTile(row2, col2);

    if (tile1 && tile2) {
      tile1.entangleWith(tile2, type);
    }
  }

  // Check if all tiles are collapsed
  isFullyCollapsed() {
    return this.tiles.every(row => row.every(tile => tile.state.isCollapsed));
  }

  // Check if grid matches target pattern
  matchesPattern(pattern) {
    if (pattern.length !== this.rows || pattern[0].length !== this.cols) {
      return false;
    }

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const tile = this.tiles[r][c];
        const target = pattern[r][c];

        // -1 in pattern means "any state"
        if (target === -1) {
          continue;
        }

        if (!tile.state.isCollapsed || tile.state.collapsedState !== target) {
          return false;
        }
      }
    }

    return true;
  }

  // Get current pattern
  getCurrentPattern() {
    return this.tiles.map(row =>
      row.map(tile => tile.state.isCollapsed ? tile.state.collapsedState : null)
    );
  }

  // Clone the grid (for undo functionality)
  clone() {
    const grid = new QuantumGrid(this.rows, this.cols, this.numStates);

    // Clone tiles
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        grid.tiles[r][c] = this.tiles[r][c].clone();
      }
    }

    // Recreate entanglements
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const originalTile = this.tiles[r][c];
        const clonedTile = grid.tiles[r][c];

        originalTile.entangledWith.forEach(({ tile: entangledTile, type }) => {
          const clonedEntangled = grid.tiles[entangledTile.row][entangledTile.col];
          if (!clonedTile.entangledWith.find(e => e.tile === clonedEntangled)) {
            clonedTile.entangledWith.push({ tile: clonedEntangled, type });
          }
        });
      }
    }

    return grid;
  }
}
