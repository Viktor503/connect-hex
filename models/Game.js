const board = require("./GameBoard");

class Game {
    constructor(board_size) {
        this.board_size = board_size;
        this.board = new board(board_size, board_size);
    }
}

module.exports = Game;
