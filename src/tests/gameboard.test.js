import { Gameboard } from "../js/Gameboard.js";
import { Ship } from "../js/Ship.js";

describe("Gameboard class", () => {
  const gameboard = new Gameboard();
  const ship = new Ship(3);

  it("places a ship at specific coordinates", () => {
    gameboard.placeShip(ship, 0, 0, "horizontal");
    expect(gameboard.hasShip(0, 0)).toEqual(true);
    expect(gameboard.hasShip(1, 0)).toEqual(true);
    expect(gameboard.hasShip(2, 0)).toEqual(true);
    expect(gameboard.hasShip(3, 0)).toEqual(false);
  });

  it("received an attack", () => {
    gameboard.receiveAttack(0, 0);
    expect(ship.hits).toEqual(1);
  });

  it("missed an attack", () => {
    gameboard.receiveAttack(3, 0);
    expect(gameboard.missedShots.length).toEqual(1);
  });

  it("has all ships sunk", () => {
    gameboard.receiveAttack(1, 0);
    gameboard.receiveAttack(2, 0);
    expect(gameboard.hasAllShipsSunk()).toEqual(true);
  });
});
