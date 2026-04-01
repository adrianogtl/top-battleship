import { Player } from "../js/Player.js";
describe("Player class", () => {
  const player = new Player("real");
  it("is a real player", () => {
    expect(player.type).toEqual("real");
  });

  it("has a gameboard", () => {
    expect(player.gameboard).toEqual({});
  });
});
