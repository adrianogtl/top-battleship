import Ship from "./Ship.js";

export default class DOMManager {
  #game;
  #boardSize = 10;
  #selectedShip = null;
  #shipDirection = "horizontal";
  #placedShips = [];
  #isComputerTurn = false;

  static SHIP_TYPES = [
    { name: "Battleship", length: 4 },
    { name: "Cruiser", length: 3 },
    { name: "Destroyer", length: 2 },
    { name: "Submarine", length: 2 },
  ];

  constructor() {
    this.#game = null;
  }

  setGame(game) {
    this.#game = game;
  }

  render() {
    if (!this.#game) return;

    const gameState = this.#game.gameState;

    if (gameState === "setup") {
      this.renderSetup();
    } else if (gameState === "playing") {
      this.renderGame();
    } else if (gameState === "gameover") {
      this.renderGameOver();
    }
  }

  renderSetup() {
    // Reset placed ship tracker if board is empty (fresh game)
    const boardHasNoShips =
      Object.keys(this.#game.humanPlayer.gameboard.ships).length === 0;
    if (boardHasNoShips && this.#placedShips.length > 0) {
      this.#placedShips = [];
      this.#selectedShip = null;
    }

    this.clearDOM();

    const root = document.createElement("div");
    root.id = "app";

    const title = document.createElement("h1");
    title.textContent = "Battleship - Place Your Ships";

    const instructions = document.createElement("p");
    instructions.id = "instructions";
    instructions.textContent =
      "Select a ship, then click on the board to place it.";

    // Ship selection UI
    const shipSelector = document.createElement("div");
    shipSelector.id = "ship-selector";

    const shipBtnContainer = document.createElement("div");
    shipSelector.appendChild(shipBtnContainer);

    const shipsToPlace = DOMManager.SHIP_TYPES.filter(
      (shipType) =>
        !this.#placedShips.find((placed) => placed.name === shipType.name),
    );

    if (shipsToPlace.length > 0) {
      shipsToPlace.forEach((shipType) => {
        const btn = document.createElement("button");
        btn.className = "ship-btn";
        btn.textContent = `${shipType.name} (${shipType.length})`;

        if (this.#selectedShip?.name === shipType.name) {
          btn.classList.add("selected");
        }

        btn.addEventListener("click", () => {
          this.#selectedShip = shipType;
          this.renderSetup();
        });

        shipBtnContainer.appendChild(btn);
      });

      // Direction toggle
      const directionToggle = document.createElement("button");
      directionToggle.id = "direction-btn";
      directionToggle.textContent = `Direction: ${this.#shipDirection}`;
      directionToggle.addEventListener("click", () => {
        this.#shipDirection =
          this.#shipDirection === "horizontal" ? "vertical" : "horizontal";
        this.renderSetup();
      });

      shipSelector.appendChild(directionToggle);
    }

    const boardContainer = document.createElement("div");
    boardContainer.id = "board";
    boardContainer.classList.add("board");

    this.renderBoard(boardContainer, this.#game.humanPlayer, true);

    const footer = document.createElement("div");
    footer.id = "footer";

    const placedList = document.createElement("p");
    placedList.id = "placed-ships";
    placedList.textContent = `Ships placed: ${this.#placedShips.length}/${DOMManager.SHIP_TYPES.length}`;

    const startBtn = document.createElement("button");
    startBtn.id = "start-btn";
    startBtn.textContent = "Start Game";
    startBtn.disabled =
      this.#placedShips.length !== DOMManager.SHIP_TYPES.length;
    startBtn.addEventListener("click", () => {
      this.#game.startGame();
      this.render();
    });

    footer.append(placedList, startBtn);
    root.append(title, instructions, shipSelector, boardContainer, footer);
    document.body.appendChild(root);
  }

  renderGame() {
    this.clearDOM();

    const root = document.createElement("div");
    root.id = "app";

    const title = document.createElement("h1");
    title.textContent = "Battleship";

    const status = document.createElement("div");
    status.id = "status";
    if (this.#isComputerTurn) {
      status.textContent = "Computer's turn to attack...";
      status.classList.add("enemy-turn");
    } else {
      status.textContent = "Your turn to attack";
      status.classList.add("player-turn");
    }

    const container = document.createElement("div");
    container.id = "board-container";

    const playerSection = document.createElement("div");
    playerSection.className = "player-section";
    const playerLabel = document.createElement("h3");
    playerLabel.textContent = "Your Board";
    const playerBoard = document.createElement("div");
    playerBoard.className = "board";
    this.renderBoard(playerBoard, this.#game.humanPlayer, false);
    playerSection.append(playerLabel, playerBoard);

    const enemySection = document.createElement("div");
    enemySection.className = "player-section";
    const enemyLabel = document.createElement("h3");
    enemyLabel.textContent = "Computer Board";
    const enemyBoard = document.createElement("div");
    enemyBoard.className = "board";
    this.renderBoard(
      enemyBoard,
      this.#game.computerPlayer,
      !this.#isComputerTurn,
    );
    enemySection.append(enemyLabel, enemyBoard);

    container.append(playerSection, enemySection);

    root.append(title, status, container);
    document.body.appendChild(root);
  }

  renderGameOver() {
    this.clearDOM();

    const root = document.createElement("div");
    root.id = "app";

    const title = document.createElement("h1");
    title.textContent = "Battleship - Game Over";

    const winner = this.#game.getWinner();
    const message = document.createElement("p");
    message.id = "winner-message";
    message.textContent = `${winner.type.toUpperCase()} won the game!`;

    // Show final boards
    const boardContainer = document.createElement("div");
    boardContainer.id = "board-container";

    const playerSection = document.createElement("div");
    playerSection.className = "player-section";
    const playerLabel = document.createElement("h3");
    playerLabel.textContent = "Your Board";
    const playerBoard = document.createElement("div");
    playerBoard.className = "board";
    this.renderBoard(playerBoard, this.#game.humanPlayer, false);
    playerSection.append(playerLabel, playerBoard);

    const enemySection = document.createElement("div");
    enemySection.className = "player-section";
    const enemyLabel = document.createElement("h3");
    enemyLabel.textContent = "Enemy Board";
    const enemyBoard = document.createElement("div");
    enemyBoard.className = "board";
    this.renderBoard(enemyBoard, this.#game.computerPlayer, false);
    enemySection.append(enemyLabel, enemyBoard);

    boardContainer.append(playerSection, enemySection);

    const restartBtn = document.createElement("button");
    restartBtn.id = "restart-btn";
    restartBtn.textContent = "Play Again";
    restartBtn.addEventListener("click", () => {
      this.#game.restartGame();
      this.#isComputerTurn = false;
      this.render();
    });

    root.append(title, message, boardContainer, restartBtn);
    document.body.appendChild(root);
  }

  renderBoard(container, player, isClickable) {
    container.innerHTML = "";

    for (let y = 0; y < this.#boardSize; y++) {
      const row = document.createElement("div");
      row.classList.add("row");

      for (let x = 0; x < this.#boardSize; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.x = x;
        cell.dataset.y = y;

        const gameboard = player.gameboard;
        const coords = `${x}, ${y}`;

        // Show own ships on player's board or hits received
        if (player === this.#game.humanPlayer) {
          if (gameboard.hitShots.includes(coords)) {
            cell.classList.add("hit");
          } else if (gameboard.missedShots.includes(coords)) {
            cell.classList.add("miss");
          } else if (gameboard.hasShip(x, y)) {
            cell.classList.add("ship");
          }
        } else {
          // Enemy board: show only attacks made
          if (gameboard.hitShots.includes(coords)) {
            cell.classList.add("hit");
          } else if (gameboard.missedShots.includes(coords)) {
            cell.classList.add("miss");
          }
        }

        if (isClickable) {
          cell.addEventListener("click", () =>
            this.handleCellClick(x, y, player),
          );
        }

        row.appendChild(cell);
      }

      container.appendChild(row);
    }
  }

  handleCellClick(x, y, player) {
    if (!this.#game) return;

    if (this.#game.gameState === "setup") {
      if (player !== this.#game.humanPlayer) return;

      if (!this.#selectedShip) {
        alert("Please select a ship first");
        return;
      }

      // Validate placement
      if (!this.isValidPlacement(x, y, this.#selectedShip.length)) {
        alert("Cannot place ship there. Check bounds and overlaps.");
        return;
      }

      // Place the ship
      const ship = new Ship(this.#selectedShip.length);
      this.#game.placeShip(player, ship, x, y, this.#shipDirection);

      // Track as placed
      this.#placedShips.push(this.#selectedShip);
      this.#selectedShip = null;

      this.renderSetup();
    } else if (this.#game.gameState === "playing") {
      // Prevent clicks during computer's turn
      if (this.#isComputerTurn) return;

      // Only allow attacking enemy board
      if (
        player === this.#game.computerPlayer &&
        this.#game.currentPlayer === this.#game.humanPlayer
      ) {
        this.#game.playTurn(this.#game.humanPlayer, x, y);

        // Computer's turn after a delay
        if (!this.#game.isGameOver()) {
          this.#isComputerTurn = true;
          this.render();

          setTimeout(() => {
            const attack = this.#game.getComputerAttack();
            this.#game.playTurn(this.#game.computerPlayer, attack.x, attack.y);
            this.#isComputerTurn = false;
            this.render();
          }, 2000);
        } else {
          this.render();
        }
      }
    }
  }

  isValidPlacement(x, y, length) {
    const gameboard = this.#game.humanPlayer.gameboard;

    if (this.#shipDirection === "horizontal") {
      // Check bounds
      if (x + length > this.#boardSize) return false;

      // Check for overlaps
      for (let i = 0; i < length; i++) {
        if (gameboard.hasShip(x + i, y)) return false;
      }
    } else {
      // vertical
      // Check bounds
      if (y + length > this.#boardSize) return false;

      // Check for overlaps
      for (let i = 0; i < length; i++) {
        if (gameboard.hasShip(x, y + i)) return false;
      }
    }

    return true;
  }

  clearDOM() {
    document.body.innerHTML = "";
  }
}
