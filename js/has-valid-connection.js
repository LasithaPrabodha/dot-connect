import { isAdjacentToPreviousDot } from "./common.js";

// Function to check if a line between two dots intersects any previously selected dots
export function hasValidConnect(startRow, startCol, endRow, endCol) {
  const isHorizontal = startRow === endRow;
  const isVertical = startCol === endCol;

  // If the line is diagonal
  if (!isHorizontal && !isVertical) {
    return false;
  }

  if (!isAdjacentToPreviousDot(startRow, startCol, endRow, endCol)) {
    return false;
  }

  return true;
}

