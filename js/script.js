import { isSameColor, isValidDot } from "./common.js";
import { hasValidConnect } from "./has-valid-connection.js";
import { findLongestConnectionWithColor } from "./find-longest-connection-with-color.js";
import LinkedList from "./linked-list.js";

const delay = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

const modes = {
  AI: "AI",
  HUMAN: "HUMAN",
};

document.addEventListener("DOMContentLoaded", () => {
  const gridElm = document.getElementById("game-grid");
  const grid = [];
  const scoreDisplayP1 = document.getElementById("score-value-1");
  const scoreDisplayP2 = document.getElementById("score-value-2");
  const btnHuman = document.getElementById("gm-human");
  const btnAi = document.getElementById("gm-ai");
  const startButton = document.getElementById("start-button");
  const gameModeElm = document.querySelector(".game-mode");
  const gameWrapperElm = document.querySelector(".game-wrapper");
  let turn = 0;
  let moves = 0;
  let mode = null;

  let lastSelectedDot = null;
  let score = [0, 0];
  let selectedDots = new LinkedList();

  function generateGrid() {
    gridElm.innerHTML = "";

    for (let i = 0; i < numRows; i++) {
      grid[i] = [];
      for (let j = 0; j < numCols; j++) {
        const dot = document.createElement("div");
        const color = getRandomColor();
        dot.classList.add("dot");
        dot.dataset.color = color;
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
    const clickedDotColor = clickedDot.dataset.color;
    const clickedDotRow = +clickedDot.dataset.row;
    const clickedDotCol = +clickedDot.dataset.col;

    processDotSelection(clickedDot, clickedDotColor, clickedDotRow, clickedDotCol);
  }

  function updateUi(clickedDot, clickedDotRow, clickedDotCol) {
    const isSelected = selectedDots.contains(clickedDotRow, clickedDotCol);

    if (!isSelected) {
      selectedDots.append(clickedDotRow, clickedDotCol);
      clickedDot.classList.add("selected");
      updateMoves();
    } else {
      selectedDots.remove(clickedDotRow, clickedDotCol);
      clickedDot.classList.remove("selected");
    }
  }

  function updateTurn() {
    document.querySelector(`#score${turn + 1}`).classList.remove("turn");
    turn = +!turn;
    document.querySelector(`#score${turn + 1}`).classList.add("turn");
  }

  function updateScoreAndReset() {
    updateScore(selectedDots.length);
    removeSelectedDots();
    updateTurn();
    selectedDots = new LinkedList();
  }

  async function processDotSelection(clickedDot, clickedDotColor, clickedDotRow, clickedDotCol) {
    if (isNaN(clickedDotRow) && isNaN(clickedDotCol)) return;

    updateUi(clickedDot, clickedDotRow, clickedDotCol);

    let isValid = false;
    if (lastSelectedDot && lastSelectedDot.color === clickedDotColor) {
      isValid = hasValidConnect(lastSelectedDot.row, lastSelectedDot.col, clickedDotRow, clickedDotCol, selectedDots);
    }

    if (isValid) {
      const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];

      let hasValidAdjacent = false;

      for (const [dx, dy] of directions) {
        const newRow = clickedDotRow + dx;
        const newCol = clickedDotCol + dy;
        const isNewDotValid =
          isValidDot(newRow, newCol, numRows, numCols) &&
          isSameColor(newRow, newCol, clickedDotColor, grid) &&
          !selectedDots.contains(newRow, newCol);

        if (isNewDotValid) {
          hasValidAdjacent = true;
        }
      }

      if (!hasValidAdjacent) {
        await delay(300);
        updateScoreAndReset();

        if (mode === modes.AI && turn == 1) {
          const longest = findLongestConnectionWithColor(grid);

          let current = longest.head;
          while (current) {
            const cell = document.querySelector(`.dot[data-row="${current.row}"][data-col="${current.col}"]`);

            updateUi(cell, current.row, current.col);
            await delay(300);

            current = current.next;
          }

          updateScoreAndReset();
        }
        return;
      }
    } else {
      // clear previously selected dots
      if (lastSelectedDot) {
        await delay(300);
        removeSelectedDots(false);
        selectedDots = new LinkedList();
        return;
      }
    }

    lastSelectedDot = { row: clickedDotRow, col: clickedDotCol, color: clickedDotColor };
  }

  function updateScore(newScore) {
    if (turn === 0) {
      score[0] += newScore;
      scoreDisplayP1.textContent = score[0];
    } else {
      score[1] += newScore;
      scoreDisplayP2.textContent = score[1];
    }
  }

  function updateMoves() {
    moves++;
    document.querySelector("#moves").textContent = moves;
  }

  function removeSelectedDots(randomize = true) {
    let current = selectedDots.head;
    while (current !== null) {
      const cell = document.querySelector(`.dot[data-row="${current.row}"][data-col="${current.col}"]`);
      cell.classList.remove("selected");
      randomize && replaceWithRandomColor(cell, grid, current);
      current = current.next;
    }

    lastSelectedDot = null;
  }

  function replaceWithRandomColor(cell, grid, current) {
    const color = getRandomColor();

    cell.dataset.color = color;
    grid[current.row][current.col] = color;
  }

  function init() {
    moves = 0;
    document.querySelector("#moves").textContent = moves;

    const turns = [0, 1];
    turns.forEach((t) => document.querySelector(`#score${t + 1}`).classList.remove("turn"));

    if (mode === modes.HUMAN) {
      turn = turns[Math.floor(Math.random() * turns.length)];
    } else {
      turn = 0;
    }

    document.querySelector(`#score${turn + 1}`).classList.add("turn");

    score = [0, 0];
    scoreDisplayP1.textContent = 0;
    scoreDisplayP2.textContent = 0;

    gameWrapperElm.classList.add("started");
  }

  startButton.addEventListener("click", (event) => {
    if (mode == null) {
      event.target.style.display = "none";
      gameModeElm.style.display = "flex";
    }
  });

  btnHuman.addEventListener("click", () => {
    mode = modes.HUMAN;
    gameModeElm.style.display = "none";

    document.getElementById("p1").innerText = "Player 1";
    document.getElementById("p2").innerText = "Player 2";

    init();
    generateGrid();
    updateScore(0);
  });

  btnAi.addEventListener("click", () => {
    mode = modes.AI;
    gameModeElm.style.display = "none";

    document.getElementById("p1").innerText = "Your";
    document.getElementById("p2").innerText = "AI";

    init();
    generateGrid();
    updateScore(0);
  });

  gridElm.addEventListener("mousedown", (event) => {
    if (Object.keys(event.target.dataset).length) {
      handleDotClick(event);
    }
  });

  gridElm.addEventListener("mouseover", function (event) {
    if (event.buttons == 1 && Object.keys(event.target.dataset).length) {
      handleDotClick(event);
    }
  });

  document.getElementById("reset").addEventListener("click", () => {
    mode = null;
    startButton.style.display = "none";
    gameModeElm.style.display = "flex";
    gameWrapperElm.classList.remove("started");
  });
});
