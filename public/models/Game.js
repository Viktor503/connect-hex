import { Queue } from "./Queue.js";
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
    returnNeighbours(i, j) {
        let neighbours = [
            [i - 1, j - 1],
            [i - 1, j],
            [i, j - 1],
            [i, j + 1],
            [i + 1, j],
            [i + 1, j + 1],
        ];
        return neighbours;
    }

    isStartEdge(x, y, player) {
        return (x == 0 && player == 1) || (y == 0 && player == 2);
    }
    isEndEdge(x, y, player) {
        return (
            (x == this.gameBoard.size - 1 && player == 1) ||
            (y == this.gameBoard.size - 1 && player == 2)
        );
    }

    bfsToGetReachableFields(player_fields, player) {
        let board = this.gameBoard.getBoardValues();
        let queue = new Queue();
        let visited = new Set();
        queue.enqueue(player_fields[0]);

        while (queue.length() > 0) {
            let [i, j] = queue.dequeue();
            let vertexName = i + "," + j;
            if (!(vertexName in visited)) {
                visited.add(vertexName);
                let neighbours = this.returnNeighbours(i, j);
                neighbours.forEach((neighbour) => {
                    let [x, y] = neighbour;
                    let neighbourName = x + "," + y;
                    if (
                        this.validField(x, y) &&
                        board[x][y] == (player == 1 ? 1 : -1) &&
                        !visited.has(neighbourName)
                    ) {
                        queue.enqueue(neighbour);
                    }
                });
            }
        }
        return visited;
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
