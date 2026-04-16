import Player from "./Player.js";
import Ship from "./Ship.js";

export default class Game {
  static SHIP_TYPES = [
    { name: "Battleship", length: 4 },
    { name: "Cruiser", length: 3 },
    { name: "Destroyer", length: 2 },
    { name: "Submarine", length: 2 },
  ];
  #humanPlayer;
  #computerPlayer;
  #currentPlayer;
  #gameState;

  constructor() {
    this.#humanPlayer = new Player("human");
    this.#computerPlayer = new Player("computer");
    this.#gameState = "setup";
  }

  get humanPlayer() {
    return this.#humanPlayer;
  }

  get computerPlayer() {
    return this.#computerPlayer;
  }

  get currentPlayer() {
    return this.#currentPlayer;
  }

  get gameState() {
    return this.#gameState;
  }

  placeShip(player, ship, x, y, direction) {
    player.gameboard.placeShip(ship, x, y, direction);
  }

  startGame() {
    // Auto-place computer ships
    this.autoPlaceShips(this.#computerPlayer);

    this.#gameState = "playing";
    this.#currentPlayer = this.#humanPlayer;
  }

  playTurn(attacker, x, y) {
    const defender =
      attacker === this.#humanPlayer ? this.#computerPlayer : this.#humanPlayer;

    defender.gameboard.receiveAttack(x, y);

    if (this.isGameOver()) {
      this.#gameState = "gameover";
    }

    this.#currentPlayer = defender;
  }

  isGameOver() {
    return (
      this.#humanPlayer.gameboard.hasAllShipsSunk() ||
      this.#computerPlayer.gameboard.hasAllShipsSunk()
    );
  }

  getWinner() {
    if (this.#computerPlayer.gameboard.hasAllShipsSunk())
      return this.#humanPlayer;
    if (this.#humanPlayer.gameboard.hasAllShipsSunk())
      return this.#computerPlayer;
    return null;
  }

  restartGame() {
    this.#humanPlayer = new Player("human");
    this.#computerPlayer = new Player("computer");
    this.#gameState = "setup";
    this.#currentPlayer = null;
  }

  autoPlaceShips(player) {
    const boardSize = 10;

    for (const shipType of Game.SHIP_TYPES) {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 100) {
        const direction = Math.random() > 0.5 ? "horizontal" : "vertical";
        const x = Math.floor(Math.random() * boardSize);
        const y = Math.floor(Math.random() * boardSize);

        if (this.isValidPlacement(player, x, y, shipType.length, direction)) {
          const ship = new Ship(shipType.length);
          this.placeShip(player, ship, x, y, direction);
          placed = true;
        }

        attempts++;
      }
    }
  }

  isValidPlacement(player, x, y, length, direction) {
    const boardSize = 10;
    const gameboard = player.gameboard;

    if (direction === "horizontal") {
      if (x + length > boardSize) return false;
      for (let i = 0; i < length; i++) {
        if (gameboard.hasShip(x + i, y)) return false;
      }
    } else {
      if (y + length > boardSize) return false;
      for (let i = 0; i < length; i++) {
        if (gameboard.hasShip(x, y + i)) return false;
      }
    }

    return true;
  }

  getComputerAttack() {
    const gameboard = this.#humanPlayer.gameboard;
    const boardSize = 10;
    let x, y;
    let coords;

    // Generate random coordinates that haven't been attacked yet
    do {
      x = Math.floor(Math.random() * boardSize);
      y = Math.floor(Math.random() * boardSize);
      coords = `${x}, ${y}`;
    } while (
      gameboard.hitShots.includes(coords) ||
      gameboard.missedShots.includes(coords)
    );

    return { x, y };
  }
}
