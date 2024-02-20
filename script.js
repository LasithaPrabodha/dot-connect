import { findLongestPath, hasValidConnect } from "./line-helper.js";
import LinkedList from "./linked-list.js";

document.addEventListener("DOMContentLoaded", () => {
  const gridElm = document.getElementById("game-grid");
  const grid = [];
  const scoreDisplay = document.getElementById("score-value");
  const startButton = document.getElementById("start-button");

  let lastSelectedDot = null;
  let score = 0;
  let selectedDots = new LinkedList();

  function generateGrid() {
    gridElm.innerHTML = "";

    for (let i = 0; i < numRows; i++) {
      grid[i] = [];
      for (let j = 0; j < numCols; j++) {
        const dot = document.createElement("div");
        const color = getRandomColor();
        dot.classList.add("dot");
        dot.style.backgroundColor = color;
        dot.dataset.row = i;
        dot.dataset.col = j;
        gridElm.appendChild(dot);
        grid[i][j] = color;
      }
    }
  }

  function getRandomColor() {
    const colors = ["red", "blue", "green", "yellow"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function handleDotClick(event) {
    const clickedDot = event.target;
    const clickedDotColor = clickedDot.style.backgroundColor;
    const clickedDotRow = +clickedDot.dataset.row;
    const clickedDotCol = +clickedDot.dataset.col;

    const isSelected = selectedDots.contains(clickedDotRow, clickedDotCol);
    let isValid = false;
    if (lastSelectedDot && lastSelectedDot.color === clickedDotColor) {
      isValid = hasValidConnect(lastSelectedDot.row, lastSelectedDot.col, clickedDotRow, clickedDotCol, selectedDots);
    }

    if (isValid) {
      console.log("valid");
    } else {
      // clear previously selected dots

      const longestPath = findLongestPath(clickedDotRow, clickedDotCol, clickedDotColor, grid);
      console.log(longestPath);
    }

    if (!isSelected) {
      selectedDots.append(clickedDotRow, clickedDotCol);
      clickedDot.classList.add("selected");
    } else {
      selectedDots.remove(clickedDotRow, clickedDotCol);
      clickedDot.classList.remove("selected");
    }

    lastSelectedDot = { row: clickedDotRow, col: clickedDotCol, color: clickedDotColor };
    console.log(selectedDots);
  }

  function updateScore(newScore) {
    score = newScore;
    scoreDisplay.textContent = score;
  }

  gridElm.addEventListener("click", handleDotClick);

  startButton.addEventListener("click", () => {
    generateGrid();
    updateScore(0);
  });
});
