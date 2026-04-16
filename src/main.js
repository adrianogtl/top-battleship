import "./style.css";
import Game from "./js/Game.js";
import DOMManager from "./js/DOMManager.js";

const game = new Game();
const domManager = new DOMManager();

domManager.setGame(game);

domManager.render();
