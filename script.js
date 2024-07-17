const numRows = 30;
const numCols = 30;

let grid = createDefaultGrid();
let running = false;
let timer;
let generationCount = 0;

const gridElement = document.getElementById('grid');
const startStopButton = document.getElementById('start-stop');
const randomButton = document.getElementById('random');
const resetButton = document.getElementById('reset');
const generationCounter = document.getElementById('generation-counter');

function createEmptyGrid() {
  return Array.from({ length: numRows }, () => Array(numCols).fill(0));
}

function createDefaultGrid() {
  const grid = createEmptyGrid();
  // Add some gliders to the grid to ensure continuous activity
  const gliders = [
    [1, 0, 0],
    [0, 1, 1],
    [1, 1, 0]
  ];
  const startRow = Math.floor(numRows / 2) - 1;
  const startCol = Math.floor(numCols / 2) - 1;

  for (let i = 0; i < gliders.length; i++) {
    for (let j = 0; j < gliders[0].length; j++) {
      grid[startRow + i][startCol + j] = gliders[i][j];
    }
  }

  return grid;
}

function createRandomGrid() {
  return Array.from({ length: numRows }, () =>
    Array.from({ length: numCols }, () => (Math.random() > 0.7 ? 1 : 0))
  );
}

function updateGridDisplay() {
  gridElement.innerHTML = '';
  grid.forEach((row, i) => {
    row.forEach((col, j) => {
      const cell = document.createElement('div');
      cell.className = `cell ${grid[i][j] ? 'alive' : ''}`;
      cell.addEventListener('click', () => {
        grid[i][j] = grid[i][j] ? 0 : 1;
        updateGridDisplay();
      });
      gridElement.appendChild(cell);
    });
  });
  generationCounter.textContent = `Generation: ${generationCount}`;
}

function getNextGeneration(grid) {
  return grid.map((row, i) =>
    row.map((cell, j) => {
      let neighbors = 0;
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1]
      ];

      directions.forEach(([x, y]) => {
        const newI = i + x;
        const newJ = j + y;
        if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
          neighbors += grid[newI][newJ];
        }
      });

      if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
        return 0; // Underpopulation or Overpopulation
      } else if (cell === 0 && neighbors === 3) {
        return 1; // Reproduction
      } else if (cell === 1 && (neighbors === 2 || neighbors === 3)) {
        return 1; // Lives on to the next generation
      } else {
        return 0; // Remains the same
      }
    })
  );
}

function runGame() {
  if (!running) return;
  const newGrid = getNextGeneration(grid);
  if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
    grid = newGrid;
    generationCount++;
    updateGridDisplay();
  }
  timer = setTimeout(runGame, 300);
}

startStopButton.addEventListener('click', () => {
  running = !running;
  startStopButton.textContent = running ? 'Stop' : 'Start';
  if (running) {
    runGame();
  } else {
    clearTimeout(timer);
  }
});

randomButton.addEventListener('click', () => {
  grid = createRandomGrid();
  generationCount = 0;
  updateGridDisplay();
});

resetButton.addEventListener('click', () => {
  grid = createDefaultGrid();
  generationCount = 0;
  updateGridDisplay();
});

updateGridDisplay();
