class GameBoard {
    constructor(size1, size2) {
        this.size1 = size1;
        this.size2 = size2;
        this.board = new Array(size1);
        for (let i = 0; i < size1; i++) {
            this.board[i] = new Array(size2);
            for (let j = 0; j < size2; j++) {
                this.board[i][j] = 0;
            }
        }
    }

    getBoard() {
        return this.board;
    }
}

module.exports = GameBoard;
