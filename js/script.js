import { hasValidConnect, findLongestConnectionWithColor } from "./helpers.js";
import { isSameColor, isValidDot, delay } from "./utils.js";

import LinkedList from "./models/linked-list.js";
import { modes, numCols, numRows } from "./consts.js";

import "../persistence/firebase-config.js";
import { initSession } from "../persistence/write.js";

class DotGame {
  constructor() {
    this.gridElm = document.getElementById("game-grid");
    this.scoreDisplayP1 = document.getElementById("score-value-1");
    this.scoreDisplayP2 = document.getElementById("score-value-2");
    this.btnHuman = document.getElementById("gm-human");
    this.btnAi = document.getElementById("gm-ai");
    this.startButton = document.getElementById("start-button");
    this.gameModeElm = document.querySelector(".game-mode");
    this.gameWrapperElm = document.querySelector(".game-wrapper");
    this.grid = [];
    this.turn = 0;
    this.mode = null;
    this.lastSelectedDot = null;
    this.score = [0, 0];
    this.selectedDots = new LinkedList();

    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener("DOMContentLoaded", this.initializeGame.bind(this));
    this.startButton.addEventListener("click", this.showGameModes.bind(this));
    this.btnHuman.addEventListener("click", this.startHumanMode.bind(this));
    this.btnAi.addEventListener("click", this.startAIMode.bind(this));
    this.gridElm.addEventListener("mousedown", this.handleDotSelection.bind(this));
    this.gridElm.addEventListener("mouseover", this.handleDotHover.bind(this));
    document.getElementById("reset").addEventListener("click", this.resetGame.bind(this));
  }

  initializeGame() {
    this.resetUI();
  }

  resetUI() {
    this.mode = null;
    this.startButton.style.display = "none";
    this.gameModeElm.style.display = "flex";
    this.gameWrapperElm.classList.remove("started");
  }

  showGameModes(event) {
    if (!this.mode) {
      event.target.style.display = "none";
      this.gameModeElm.style.display = "flex";
    }
  }

  startHumanMode() {
    this.mode = modes.HUMAN;
    this.gameModeElm.style.display = "none";
    document.getElementById("p1").innerText = "Player 1";
    document.getElementById("p2").innerText = "Player 2";
    this.initGame();
  }

  startAIMode() {
    this.mode = modes.AI;
    this.gameModeElm.style.display = "none";
    document.getElementById("p1").innerText = "Your";
    document.getElementById("p2").innerText = "AI";
    this.initGame();
  }

  initGame() {
    this.turn = this.mode === modes.HUMAN ? Math.floor(Math.random() * 2) : 0;
    document.querySelector(`#score${this.turn + 1}`).classList.add("turn");
    this.score = [0, 0];
    this.scoreDisplayP1.textContent = 0;
    this.scoreDisplayP2.textContent = 0;
    this.gameWrapperElm.classList.add("started");
    this.generateGrid();
  }

  generateGrid() {
    this.gridElm.innerHTML = "";
    for (let i = 0; i < numRows; i++) {
      this.grid[i] = [];
      for (let j = 0; j < numCols; j++) {
        const dot = document.createElement("div");
        const color = this.getRandomColor();
        dot.classList.add("dot");
        dot.dataset.color = color;
        dot.dataset.row = i;
        dot.dataset.col = j;
        this.gridElm.appendChild(dot);
        this.grid[i][j] = color;
      }
    }
  }

  getRandomColor() {
    const colors = ["red", "blue", "green", "yellow"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  handleDotSelection(event) {
    if (
      Object.keys(event.target.dataset).length &&
      ((this.mode === modes.AI && this.turn === 0) || this.mode === modes.HUMAN)
    ) {
      this.handleDotClick(event);
    }
  }

  handleDotHover(event) {
    if (
      event.buttons === 1 &&
      Object.keys(event.target.dataset).length &&
      ((this.mode === modes.AI && this.turn === 0) || this.mode === modes.HUMAN)
    ) {
      this.handleDotClick(event);
    }
  }

  async handleDotClick(event) {
    const clickedDot = event.target;
    const clickedDotColor = clickedDot.dataset.color;
    const clickedDotRow = +clickedDot.dataset.row;
    const clickedDotCol = +clickedDot.dataset.col;
    await this.processDotSelection(clickedDot, clickedDotColor, clickedDotRow, clickedDotCol);
  }

  updateUi(clickedDot, clickedDotRow, clickedDotCol) {
    const isSelected = this.selectedDots.contains(clickedDotRow, clickedDotCol);
    if (!isSelected) {
      this.selectedDots.append(clickedDotRow, clickedDotCol);
      clickedDot.classList.add("selected");
    } else {
      this.selectedDots.remove(clickedDotRow, clickedDotCol);
      clickedDot.classList.remove("selected");
    }
  }

  updateTurn() {
    document.querySelector(`#score${this.turn + 1}`).classList.remove("turn");
    this.turn = +!this.turn;
    document.querySelector(`#score${this.turn + 1}`).classList.add("turn");
  }

  async processDotSelection(clickedDot, clickedDotColor, clickedDotRow, clickedDotCol) {
    if (isNaN(clickedDotRow) || isNaN(clickedDotCol)) return;
    this.updateUi(clickedDot, clickedDotRow, clickedDotCol);
    let isValid = false;
    if (this.lastSelectedDot && this.lastSelectedDot.color === clickedDotColor) {
      isValid = hasValidConnect(
        this.lastSelectedDot.row,
        this.lastSelectedDot.col,
        clickedDotRow,
        clickedDotCol,
        this.selectedDots
      );
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
          isValidDot(newRow, newCol) &&
          isSameColor(newRow, newCol, clickedDotColor, this.grid) &&
          !this.selectedDots.contains(newRow, newCol);
        if (isNewDotValid) {
          hasValidAdjacent = true;
        }
      }

      if (!hasValidAdjacent) {
        await delay(300);
        this.updateScoreAndReset();
        if (this.mode === modes.AI && this.turn === 1) {
          const longest = findLongestConnectionWithColor(this.grid);
          let current = longest.head;
          while (current) {
            const cell = document.querySelector(`.dot[data-row="${current.row}"][data-col="${current.col}"]`);
            this.updateUi(cell, current.row, current.col);
            await delay(300);
            current = current.next;
          }
          this.updateScoreAndReset();
        }
        return;
      }
    } else {
      if (this.lastSelectedDot) {
        await delay(300);
        this.removeSelectedDots(false);
        this.selectedDots = new LinkedList();
        return;
      }
    }
    this.lastSelectedDot = { row: clickedDotRow, col: clickedDotCol, color: clickedDotColor };
  }

  updateScoreAndReset() {
    this.updateScore(this.selectedDots.length);
    this.removeSelectedDots();
    this.updateTurn();
    this.selectedDots = new LinkedList();
  }

  updateScore(newScore) {
    if (this.turn === 0) {
      this.score[0] += newScore;
      this.scoreDisplayP1.textContent = this.score[0];
      if (this.score[0] >= 100) {
        alert(`${this.mode === modes.AI ? "You win!" : "Player 1 wins!"}`);
        this.resetUI();
      }
    } else {
      this.score[1] += newScore;
      this.scoreDisplayP2.textContent = this.score[1];
      if (this.score[1] >= 100) {
        alert(`${this.mode === modes.AI ? "AI" : "Player 2"} wins!`);
        this.resetUI();
      }
    }
  }

  removeSelectedDots(randomize = true) {
    let current = this.selectedDots.head;
    while (current !== null) {
      const cell = document.querySelector(`.dot[data-row="${current.row}"][data-col="${current.col}"]`);
      cell.classList.remove("selected");
      if (randomize) this.replaceWithRandomColor(cell, current);
      current = current.next;
    }
    this.lastSelectedDot = null;
  }

  replaceWithRandomColor(cell, current) {
    const color = this.getRandomColor();
    cell.dataset.color = color;
    this.grid[current.row][current.col] = color;
  }

  resetGame() {
    this.resetUI();
    this.generateGrid();
  }
}

new DotGame();
