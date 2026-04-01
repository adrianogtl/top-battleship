export class Gameboard {
  #ships;
  #missedShots;

  constructor() {
    this.#ships = {};
    this.#missedShots = [];
  }

  get ships() {
    return this.#ships;
  }

  get missedShots() {
    return this.#missedShots;
  }

  placeShip(ship, x, y, direction) {
    let coords;
    for (let i = 0; i < ship.length; i++) {
      if (direction === "horizontal") {
        coords = `${x + i}, ${y}`;
      } else {
        coords = `${x}, ${y + i}`;
      }

      this.#ships[coords] = ship;
    }
  }

  hasShip(x, y) {
    const coords = `${x}, ${y}`;
    return this.#ships[coords] !== undefined;
  }

  receiveAttack(x, y) {
    const coords = `${x}, ${y}`;
    if (this.hasShip(x, y)) {
      this.#ships[coords].hit();
    } else {
      this.#missedShots.push(coords);
    }
  }

  hasAllShipsSunk() {
    for (const coords in this.#ships) {
      if (!this.#ships[coords].isSunk()) {
        return false;
      }
    }

    return true;
  }
}
