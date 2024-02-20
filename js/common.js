// Function to check if a dot is valid (within grid boundaries)
export function isValidDot(row, col, numRows, numCols) {
  return row >= 0 && row < numRows && col >= 0 && col < numCols;
}

// Function to check if a dot has the same color as the selected dot
export function isSameColor(row, col, color, grid) {
  return grid[row][col] === color;
}
// Function to initialize the visited array
export function initializeVisitedArray(numRows, numCols) {
  return Array.from({ length: numRows }, () => Array(numCols).fill(false));
}
export function isAdjacentToPreviousDot(prevRow, prevCol, newRow, newCol) {
  const rowDiff = Math.abs(newRow - prevRow);
  const colDiff = Math.abs(newCol - prevCol);
  return rowDiff <= 1 && colDiff <= 1 && rowDiff + colDiff !== 0;
}
