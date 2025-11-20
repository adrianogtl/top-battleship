import { Ship, shipTypes } from "../core/ship.js";

describe("Ship class", () => {
  it("creates ship with correct length", () => {
    const ship = new Ship(shipTypes.aircraftCarrier);
    expect(ship.length).toEqual(5);
  });

  it("hit the ship twice", () => {
    const ship = new Ship(shipTypes.submarine);
    ship.hit();
    ship.hit();
    expect(ship.hits).toEqual(2);
  });
});

it("the ship sunk", () => {
  const ship = new Ship(shipTypes.corvette);
  ship.hit();
  expect(ship.isSunk()).toEqual(false);
  ship.hit();
  expect(ship.isSunk()).toEqual(true);
});
