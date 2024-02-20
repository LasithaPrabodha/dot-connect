import LinkedList from "./linked-list.js";

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

function isAdjacentToPreviousDot(prevRow, prevCol, newRow, newCol) {
  const rowDiff = Math.abs(newRow - prevRow);
  const colDiff = Math.abs(newCol - prevCol);
  return rowDiff <= 1 && colDiff <= 1 && rowDiff + colDiff !== 0;
}

// Function to initialize the visited array
function initializeVisitedArray(numRows, numCols) {
  const visited = [];
  for (let i = 0; i < numRows; i++) {
    visited[i] = [];
    for (let j = 0; j < numCols; j++) {
      visited[i][j] = false;
    }
  }
  return visited;
}

// Function to find the longest path starting from the first selected dot
export function findLongestPath(startRow, startCol, color, grid) {
  const numRows = grid.length;
  const numCols = grid[0].length;
  const visited = initializeVisitedArray(numRows, numCols);
  let longestPath = new LinkedList();

  // Recursive DFS function
  function dfs(row, col, path) {
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
      const isNewDotValid =
        isValidDot(newRow, newCol, numRows, numCols) &&
        !visited[newRow][newCol] &&
        isSameColor(newRow, newCol, color, grid) &&
        isAdjacentToPreviousDot(row, col, newRow, newCol);
      if (isNewDotValid) {
        dfs(newRow, newCol, path); // Recursive call
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
    path.remove(row, col);
  }

  // Start DFS from the initial dot
  dfs(startRow, startCol, new LinkedList());

  return longestPath;
}

// Function to check if a dot is valid (within grid boundaries)
function isValidDot(row, col, numRows, numCols) {
  return row >= 0 && row < numRows && col >= 0 && col < numCols;
}

// Function to check if a dot has the same color as the selected dot
function isSameColor(row, col, color, grid) {
  return grid[row][col] === color;
}
