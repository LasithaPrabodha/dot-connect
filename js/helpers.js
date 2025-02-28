import { numCols, numRows } from "./consts.js";
import LinkedList from "./models/linked-list.js";
import { isSameColor, isValidDot } from "./utils.js";

// initialize the visited array
export function initializeVisitedArray() {
  return Array.from({ length: numRows }, () => Array(numCols).fill(false));
}
export function isAdjacentToPreviousDot(prevRow, prevCol, newRow, newCol) {
  const rowDiff = Math.abs(newRow - prevRow);
  const colDiff = Math.abs(newCol - prevCol);
  return rowDiff <= 1 && colDiff <= 1 && rowDiff + colDiff !== 0;
}

// check if a line between two dots intersects any previously selected dots
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

// find the longest connection of dots with the same color from the grid
export function findLongestConnectionWithColor(grid) {
  let longestPath = new LinkedList();

  // DFS traversal
  function dfs(row, col, color, visited, path) {
    visited[row][col] = true;
    path.append(row, col);

    // Explore adjacent dots (up, down, left, right)
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      const isValid =
        isValidDot(newRow, newCol) && isSameColor(newRow, newCol, color, grid) && !visited[newRow][newCol];

      if (isValid) {
        dfs(newRow, newCol, color, visited, path); // Recursive call
      }
    }

    // Update the longest path if the current path is longer
    if (path.length > longestPath.length) {
      // Create a deep copy of the path linked list
      const newPath = new LinkedList();
      let current = path.head;
      while (current) {
        newPath.append(current.row, current.col);
        current = current.next;
      }
      longestPath = newPath;
    }

    visited[row][col] = false;
    path.remove(row, col); // Backtrack: Remove the current dot from the path cuz its invalid
  }

  const visited = initializeVisitedArray();

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (!visited[i][j]) {
        const color = grid[i][j];
        dfs(i, j, color, visited, new LinkedList());
      }
    }
  }

  return longestPath;
}
