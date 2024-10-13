class Game {
    constructor(gameBoard) {
        this.gameBoard = gameBoard;
        this.currentPlayer = 1;
        this.winner = null;
    }
    validField(x, y) {
        return (
            x >= 0 &&
            x < this.gameBoard.size &&
            y >= 0 &&
            y < this.gameBoard.size
        );
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer == 1 ? -1 : 1;
    }

    paintDiagonal(name, active) {
        if (!active) {
            console.log("deactivate");
            this.gameBoard.changeDiagonalColor(name, 0xffffff, 0xffffff);
        } else {
            console.log("active");
            this.gameBoard.changeDiagonalColor(
                name,
                this.currentPlayer == 1 ? 0xff0000 : 0x0000ff,
                this.currentPlayer == 1 ? 0x990000 : 0x000099,
            );
        }
    }

    markField(name) {
        if (this.winner) return;
        if (this.gameBoard.markField(name, this.currentPlayer)) {
            this.switchPlayer();
        }
        this.paintDiagonal(name, true);
    }
}

export { Game };
