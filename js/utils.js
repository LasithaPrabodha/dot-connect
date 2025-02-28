import { numCols, numRows } from "./consts.js";

// check if a dot is valid (within grid boundaries)
export function isValidDot(row, col) {
  return row >= 0 && row < numRows && col >= 0 && col < numCols;
}

// check if a dot has the same color as the selected dot
export function isSameColor(row, col, color, grid) {
  return grid[row][col] === color;
}

export const delay = (delayInms) => new Promise((resolve) => setTimeout(resolve, delayInms));
