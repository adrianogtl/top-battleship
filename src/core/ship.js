class Ship {
  #length;
  #hits;

  constructor(length) {
    this.#length = length;
    this.#hits = 0;
  }

  get length() {
    return this.#length;
  }

  get hits() {
    return this.#hits;
  }

  hit() {
    this.#hits += 1;
  }

  isSunk() {
    return this.hits >= this.#length ? true : false;
  }
}

const shipTypes = {
  aircraftCarrier: 5,
  cruiser: 4,
  submarine: 3,
  corvette: 2,
  patrolBoat: 1,
};

export { Ship, shipTypes };
