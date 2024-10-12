class Game {
    constructor(gameBoard) {
        this.gameBoard = gameBoard;
        this.currentPlayer = 1;
        this.winner = null;
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer == 1 ? -1 : 1;
    }

    markField(name) {
        if (this.winner) return;
        if (this.gameBoard.markField(name, this.currentPlayer)) {
            this.switchPlayer();
        }
    }
}

export { Game };
