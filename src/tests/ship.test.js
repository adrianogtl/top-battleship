import Ship from "../js/Ship.js";

describe("Ship class", () => {
  it("creates ship with correct length", () => {
    const ship = new Ship(5);
    expect(ship.length).toEqual(5);
  });

  it("hit the ship twice", () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    expect(ship.hits).toEqual(2);
  });
});

it("the ship sunk", () => {
  const ship = new Ship(2);
  ship.hit();
  expect(ship.isSunk()).toEqual(false);
  ship.hit();
  expect(ship.isSunk()).toEqual(true);
});
