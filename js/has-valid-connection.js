import { isAdjacentToPreviousDot } from "./common.js";

// Function to check if a line between two dots intersects any previously selected dots
export function hasValidConnect(startRow, startCol, endRow, endCol) {
  // Check if the line is horizontal, vertical, or diagonal
  const isHorizontal = startRow === endRow;
  const isVertical = startCol === endCol;

  // If the line is diagonal, return true
  if (!isHorizontal && !isVertical) {
    return false;
  }

  if (!isAdjacentToPreviousDot(startRow, startCol, endRow, endCol)) {
    return false;
  }

  return true; // No intersections found, line can be drawn
}

