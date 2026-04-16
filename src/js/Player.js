import Gameboard from "./Gameboard.js";

export default class Player {
  #type;
  #gameboard;

  constructor(type) {
    this.#type = type;
    this.#gameboard = new Gameboard();
  }

  get type() {
    return this.#type;
  }

  get gameboard() {
    return this.#gameboard;
  }
}
