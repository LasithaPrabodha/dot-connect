"use strict";

const grid = document.getElementById("game-grid");

// Function to find all adjacent dots of the same color using BFS
export function findAdjacentDotsBFS(startRow, startCol, color) {
  const visited = new Set();
  const queue = [];
  const adjacentDots = [];

  // Function to check if a dot is valid (within grid boundaries)
  function isValidDot(row, col) {
    return row >= 0 && row < numRows && col >= 0 && col < numCols;
  }

  // Function to check if a dot has the same color as the selected dot
  function isSameColor(row, col, color) {
    const dot = grid.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    return dot && dot.style.backgroundColor === color;
  }

  queue.push({ row: startRow, col: startCol });
  visited.add(`${startRow},${startCol}`);

  while (queue.length > 0) {
    const { row, col } = queue.shift();
    adjacentDots.push({ row, col });

    // Check adjacent dots (up, down, left, right)
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (isValidDot(newRow, newCol) && !visited.has(`${newRow},${newCol}`) && isSameColor(newRow, newCol, color)) {
        queue.push({ row: newRow, col: newCol });
        visited.add(`${newRow},${newCol}`);
      }
    }
  }

  return adjacentDots;
}
