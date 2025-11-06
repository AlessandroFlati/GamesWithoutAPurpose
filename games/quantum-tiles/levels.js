// Level definitions for Quantum Tiles
// Each topic has 1 tutorial (level 0) + 4 practice levels (1-4)

export const topics = [
  {
    id: 0,
    name: 'Superposition',
    description: 'A quantum system can exist in multiple states simultaneously',
    icon: '⚛️',
    color: '#ff6b6b'
  },
  {
    id: 1,
    name: 'Wave Function Collapse',
    description: 'Observing a quantum system forces it into a single definite state',
    icon: '📊',
    color: '#4ecdc4'
  },
  {
    id: 2,
    name: 'Entanglement',
    description: 'Measuring one particle instantly affects its entangled partner',
    icon: '🔗',
    color: '#ffe66d'
  }
];

export const levels = [
  // ===== TOPIC 0: SUPERPOSITION =====

  // Level 0-0: Tutorial - Understanding Superposition
  {
    topicId: 0,
    levelNumber: 0,
    name: 'Introduction to Superposition',
    isTeaching: true,
    gridSize: { rows: 2, cols: 2 },
    numStates: 2,
    tutorial: {
      steps: [
        {
          title: 'Welcome to Quantum Tiles!',
          text: 'In this game, you\'ll learn real quantum mechanics concepts through puzzles. Let\'s start with <strong>superposition</strong>.'
        },
        {
          title: 'What is Superposition?',
          text: 'In quantum mechanics, a particle can exist in multiple states at once. See these blended tiles? They\'re in superposition - simultaneously red (state |0⟩) and cyan (state |1⟩).',
          highlight: '.game-grid'
        },
        {
          title: 'Probabilities',
          text: 'The blending shows the probability of each state. A 50-50 blend means equal probability of being state 0 or 1. This is real quantum behavior!',
          highlight: '.game-grid'
        },
        {
          title: 'Your Goal',
          text: 'Click any tile to <strong>measure</strong> it. When you measure a quantum system, it "collapses" to one state. Try clicking a tile now!',
          highlight: '.game-grid'
        }
      ]
    },
    initialState: (grid) => {
      // All tiles in equal superposition
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 2; c++) {
          grid.tiles[r][c].state.probabilities = [0.5, 0.5];
        }
      }
    },
    goalPattern: null, // Any fully collapsed pattern wins
    goalDescription: 'Collapse all tiles by clicking them',
    optimalMoves: 4,
    hint: 'Click each tile once to measure and collapse it'
  },

  // Level 0-1: Practice - Simple Superposition
  {
    topicId: 0,
    levelNumber: 1,
    name: 'Equal Probabilities',
    gridSize: { rows: 3, cols: 3 },
    numStates: 2,
    initialState: (grid) => {
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          grid.tiles[r][c].state.probabilities = [0.5, 0.5];
        }
      }
    },
    goalPattern: null,
    goalDescription: 'Collapse all tiles',
    optimalMoves: 9,
    hint: 'Click each tile to collapse it from superposition'
  },

  // Level 0-2: Practice - Biased Probabilities
  {
    topicId: 0,
    levelNumber: 2,
    name: 'Unequal Probabilities',
    gridSize: { rows: 3, cols: 3 },
    numStates: 2,
    initialState: (grid) => {
      // Center tile has different probabilities
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (r === 1 && c === 1) {
            grid.tiles[r][c].state.probabilities = [0.8, 0.2]; // Mostly state 0
          } else {
            grid.tiles[r][c].state.probabilities = [0.3, 0.7]; // Mostly state 1
          }
        }
      }
    },
    goalPattern: null,
    goalDescription: 'Observe how different probabilities affect collapse',
    optimalMoves: 9,
    hint: 'Notice how the center tile is more red (higher probability of state 0)'
  },

  // Level 0-3: Practice - Pattern Recognition
  {
    topicId: 0,
    levelNumber: 3,
    name: 'Probability Patterns',
    gridSize: { rows: 4, cols: 4 },
    numStates: 2,
    initialState: (grid) => {
      // Gradient of probabilities
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const prob0 = (r + c) / 6; // Gradient from 0 to 1
          grid.tiles[r][c].state.probabilities = [prob0, 1 - prob0];
        }
      }
    },
    goalPattern: null,
    goalDescription: 'Collapse all tiles and observe the probability gradient',
    optimalMoves: 16,
    hint: 'Notice the gradient from red to cyan across the grid'
  },

  // Level 0-4: Practice - Complex Superposition
  {
    topicId: 0,
    levelNumber: 4,
    name: 'Mastering Superposition',
    gridSize: { rows: 4, cols: 4 },
    numStates: 2,
    initialState: (grid) => {
      // Checkerboard pattern of probabilities
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if ((r + c) % 2 === 0) {
            grid.tiles[r][c].state.probabilities = [0.9, 0.1];
          } else {
            grid.tiles[r][c].state.probabilities = [0.1, 0.9];
          }
        }
      }
    },
    goalPattern: null,
    goalDescription: 'Collapse the checkerboard pattern',
    optimalMoves: 16,
    hint: 'The checkerboard shows how superposition can create patterns'
  },

  // ===== TOPIC 1: WAVE FUNCTION COLLAPSE =====

  // Level 1-0: Tutorial - Measurement and Collapse
  {
    topicId: 1,
    levelNumber: 0,
    name: 'Understanding Measurement',
    isTeaching: true,
    gridSize: { rows: 2, cols: 2 },
    numStates: 2,
    tutorial: {
      steps: [
        {
          title: 'Wave Function Collapse',
          text: 'You\'ve seen superposition. Now let\'s learn about <strong>measurement</strong> - the act of observing a quantum system.'
        },
        {
          title: 'Collapse is Irreversible',
          text: 'When you measure (click) a tile, it <strong>collapses</strong> from superposition to a definite state. This is irreversible - a key quantum principle!',
          highlight: '.game-grid'
        },
        {
          title: 'Goal-Oriented Collapse',
          text: 'Now you have a specific goal: make all tiles state 0 (red). Click tiles until they all become red.',
          highlight: '.game-grid'
        },
        {
          title: 'Strategy Matters',
          text: 'Since collapse is probabilistic, you might need to click multiple times if a tile collapses to the wrong state. Think strategically!'
        }
      ]
    },
    initialState: (grid) => {
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 2; c++) {
          grid.tiles[r][c].state.probabilities = [0.7, 0.3]; // Favors state 0
        }
      }
    },
    goalPattern: [[0, 0], [0, 0]],
    goalDescription: 'Make all tiles state 0 (red)',
    optimalMoves: 4,
    hint: 'Click tiles that aren\'t red. You might need multiple attempts!'
  },

  // Level 1-1: Practice - All Red
  {
    topicId: 1,
    levelNumber: 1,
    name: 'Target State',
    gridSize: { rows: 3, cols: 3 },
    numStates: 2,
    initialState: (grid) => {
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          grid.tiles[r][c].state.probabilities = [0.6, 0.4];
        }
      }
    },
    goalPattern: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    goalDescription: 'Collapse all tiles to state 0 (red)',
    optimalMoves: 9,
    hint: 'Keep clicking until all tiles are red'
  },

  // Level 1-2: Practice - All Cyan
  {
    topicId: 1,
    levelNumber: 2,
    name: 'Opposite Target',
    gridSize: { rows: 3, cols: 3 },
    numStates: 2,
    initialState: (grid) => {
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          grid.tiles[r][c].state.probabilities = [0.4, 0.6];
        }
      }
    },
    goalPattern: [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
    goalDescription: 'Collapse all tiles to state 1 (cyan)',
    optimalMoves: 9,
    hint: 'Make all tiles cyan by measuring them'
  },

  // Level 1-3: Practice - Checkerboard Pattern
  {
    topicId: 1,
    levelNumber: 3,
    name: 'Alternating Pattern',
    gridSize: { rows: 4, cols: 4 },
    numStates: 2,
    initialState: (grid) => {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          grid.tiles[r][c].state.probabilities = [0.5, 0.5];
        }
      }
    },
    goalPattern: [
      [0, 1, 0, 1],
      [1, 0, 1, 0],
      [0, 1, 0, 1],
      [1, 0, 1, 0]
    ],
    goalDescription: 'Create a checkerboard pattern',
    optimalMoves: 16,
    hint: 'Click tiles until they match the checkerboard pattern'
  },

  // Level 1-4: Practice - Specific Pattern
  {
    topicId: 1,
    levelNumber: 4,
    name: 'Precise Collapse',
    gridSize: { rows: 4, cols: 4 },
    numStates: 2,
    initialState: (grid) => {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          grid.tiles[r][c].state.probabilities = [0.5, 0.5];
        }
      }
    },
    goalPattern: [
      [0, 0, 1, 1],
      [0, 0, 1, 1],
      [1, 1, 0, 0],
      [1, 1, 0, 0]
    ],
    goalDescription: 'Create the target quadrant pattern',
    optimalMoves: 16,
    hint: 'Match the pattern shown - this tests your understanding of collapse'
  },

  // ===== TOPIC 2: ENTANGLEMENT =====

  // Level 2-0: Tutorial - Quantum Entanglement
  {
    topicId: 2,
    levelNumber: 0,
    name: 'Introduction to Entanglement',
    isTeaching: true,
    gridSize: { rows: 2, cols: 3 },
    numStates: 2,
    tutorial: {
      steps: [
        {
          title: 'Quantum Entanglement',
          text: '<strong>Entanglement</strong> is when particles are correlated - measuring one instantly affects the other, even across distances!'
        },
        {
          title: 'Linked Tiles',
          text: 'See the glowing lines? Those tiles are <strong>entangled</strong>. When you measure one, its partner collapses to the same state!',
          highlight: '.game-grid'
        },
        {
          title: 'Spooky Action',
          text: 'Einstein called this "spooky action at a distance." It\'s real, and it\'s one of the most counterintuitive aspects of quantum mechanics.',
        },
        {
          title: 'Strategic Entanglement',
          text: 'Click one entangled tile and watch its partner collapse too! Use entanglement strategically to solve puzzles efficiently.'
        }
      ]
    },
    initialState: (grid) => {
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
          grid.tiles[r][c].state.probabilities = [0.5, 0.5];
        }
      }
      // Create entanglement pairs
      grid.createEntanglement(0, 0, 0, 1, 'same'); // Top-left and top-middle
      grid.createEntanglement(1, 0, 1, 1, 'same'); // Bottom-left and bottom-middle
    },
    entanglements: [
      { tile1: [0, 0], tile2: [0, 1], type: 'same' },
      { tile1: [1, 0], tile2: [1, 1], type: 'same' }
    ],
    goalPattern: null,
    goalDescription: 'Collapse all tiles (use entanglement to save moves!)',
    optimalMoves: 4, // 2 pairs + 2 singles = 4 clicks instead of 6
    hint: 'Click entangled tiles to collapse both at once'
  },

  // Level 2-1: Practice - Simple Pairs
  {
    topicId: 2,
    levelNumber: 1,
    name: 'Entangled Pairs',
    gridSize: { rows: 2, cols: 4 },
    numStates: 2,
    initialState: (grid) => {
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 4; c++) {
          grid.tiles[r][c].state.probabilities = [0.5, 0.5];
        }
      }
      grid.createEntanglement(0, 0, 1, 0, 'same');
      grid.createEntanglement(0, 1, 1, 1, 'same');
      grid.createEntanglement(0, 2, 1, 2, 'same');
      grid.createEntanglement(0, 3, 1, 3, 'same');
    },
    entanglements: [
      { tile1: [0, 0], tile2: [1, 0], type: 'same' },
      { tile1: [0, 1], tile2: [1, 1], type: 'same' },
      { tile1: [0, 2], tile2: [1, 2], type: 'same' },
      { tile1: [0, 3], tile2: [1, 3], type: 'same' }
    ],
    goalPattern: null,
    goalDescription: 'Collapse all tiles using entanglement',
    optimalMoves: 4,
    hint: 'Click one tile from each entangled pair'
  },

  // Level 2-2: Practice - Opposite Entanglement
  {
    topicId: 2,
    levelNumber: 2,
    name: 'Anti-Correlation',
    gridSize: { rows: 3, cols: 2 },
    numStates: 2,
    initialState: (grid) => {
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 2; c++) {
          grid.tiles[r][c].state.probabilities = [0.5, 0.5];
        }
      }
      // Opposite entanglement
      grid.createEntanglement(0, 0, 0, 1, 'opposite');
      grid.createEntanglement(1, 0, 1, 1, 'opposite');
      grid.createEntanglement(2, 0, 2, 1, 'opposite');
    },
    entanglements: [
      { tile1: [0, 0], tile2: [0, 1], type: 'opposite' },
      { tile1: [1, 0], tile2: [1, 1], type: 'opposite' },
      { tile1: [2, 0], tile2: [2, 1], type: 'opposite' }
    ],
    goalPattern: [
      [0, 1],
      [0, 1],
      [0, 1]
    ],
    goalDescription: 'Create the alternating column pattern',
    optimalMoves: 3,
    hint: 'These pairs collapse to opposite states!'
  },

  // Level 2-3: Practice - Entanglement Chain
  {
    topicId: 2,
    levelNumber: 3,
    name: 'Cascade Effect',
    gridSize: { rows: 2, cols: 5 },
    numStates: 2,
    initialState: (grid) => {
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 5; c++) {
          grid.tiles[r][c].state.probabilities = [0.5, 0.5];
        }
      }
      // Chain: collapse one affects all
      grid.createEntanglement(0, 0, 0, 1, 'same');
      grid.createEntanglement(0, 1, 0, 2, 'same');
      grid.createEntanglement(0, 2, 0, 3, 'same');
      grid.createEntanglement(0, 3, 0, 4, 'same');
      // Bottom row separate
    },
    entanglements: [
      { tile1: [0, 0], tile2: [0, 1], type: 'same' },
      { tile1: [0, 1], tile2: [0, 2], type: 'same' },
      { tile1: [0, 2], tile2: [0, 3], type: 'same' },
      { tile1: [0, 3], tile2: [0, 4], type: 'same' }
    ],
    goalPattern: null,
    goalDescription: 'Collapse all tiles (top row is a chain!)',
    optimalMoves: 6,
    hint: 'One click on the top row collapses the entire chain'
  },

  // Level 2-4: Practice - Complex Network
  {
    topicId: 2,
    levelNumber: 4,
    name: 'Entanglement Network',
    gridSize: { rows: 3, cols: 3 },
    numStates: 2,
    initialState: (grid) => {
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          grid.tiles[r][c].state.probabilities = [0.5, 0.5];
        }
      }
      // Complex network
      grid.createEntanglement(1, 1, 0, 1, 'same'); // Center to top
      grid.createEntanglement(1, 1, 1, 0, 'same'); // Center to left
      grid.createEntanglement(1, 1, 1, 2, 'same'); // Center to right
      grid.createEntanglement(1, 1, 2, 1, 'same'); // Center to bottom
    },
    entanglements: [
      { tile1: [1, 1], tile2: [0, 1], type: 'same' },
      { tile1: [1, 1], tile2: [1, 0], type: 'same' },
      { tile1: [1, 1], tile2: [1, 2], type: 'same' },
      { tile1: [1, 1], tile2: [2, 1], type: 'same' }
    ],
    goalPattern: null,
    goalDescription: 'Collapse all tiles (center controls 4 tiles!)',
    optimalMoves: 5,
    hint: 'Clicking the center collapses 5 tiles at once'
  }
];
