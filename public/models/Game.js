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

    async checkIfFieldsAreWinning(player_fields, player) {
        let startEdgeFound = false;
        let endEdgeFound = false;
        player_fields.forEach((field) => {
            let [i, j] = field;
            startEdgeFound = startEdgeFound || this.isStartEdge(i, j, player);
            endEdgeFound = endEdgeFound || this.isEndEdge(i, j, player);
        });
        console.log("Start edge found:", startEdgeFound);
        console.log("End edge found:", endEdgeFound);
        if (startEdgeFound && endEdgeFound) {
            this.winner = player;
            // await this.gameBoard.flashFields.then(() => {
            //     console.log("Player " + player + " wins!");
            // });
            await this.gameBoard
                .flashFields(
                    player_fields,
                    player == 1 ? 0xff0000 : 0x0000ff,
                    0xffffff,
                )
                .then(() => {
                    alert("Player " + player + " wins!");
                });

            return;
        }
    }

    winCheck(player = this.currentPlayer) {
        let board = this.gameBoard.getBoardValues();
        let boardstring = JSON.stringify(board);
        boardstring = boardstring.replaceAll("],[", "]\n[");

        let playerFields = this.gameBoard.getPlayerFields(player);
        while (playerFields.length > 0) {
            let playerVisitedSetStrings = this.bfsToGetReachableFields(
                playerFields,
                player,
            );
            let playerVisitedFields = Array.from(playerVisitedSetStrings).map(
                (field) => field.split(",").map((x) => parseInt(x)),
            );
            console.log("Visited by player strings:", playerVisitedSetStrings);
            console.log("Visited by player fields:", playerVisitedFields);
            this.checkIfFieldsAreWinning(playerVisitedFields, player);
            playerFields = playerFields.filter(
                (field) =>
                    !playerVisitedSetStrings.has(field[0] + "," + field[1]),
            );
        }
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer == 1 ? 2 : 1;
    }

    paintDiagonal(name, active) {
        if (!active) {
            this.gameBoard.changeDiagonalColor(name, 0xffffff, 0xffffff);
        } else {
            this.gameBoard.changeDiagonalColor(
                name,
                this.currentPlayer == 1 ? 0xff0000 : 0x0000ff,
                this.currentPlayer == 1 ? 0x990000 : 0x000099,
            );
        }
    }

    paintField(name,active){
        if (!active) {
            this.gameBoard.changeFieldColor(name, 0xffffff);
        } else {
            this.gameBoard.changeFieldColor(
                name,
                this.currentPlayer == 1 ? 0xff0000 : 0x0000ff
            );
        }
    }

    paintMove(name,active,hex_mode){
        if(hex_mode){
            this.paintField(name,active);
        }else{
            this.paintDiagonal(name,active);
        }
    }

    markField(name,hex_mode) {
        if (this.winner) return;
        console.log("Hex mode from game.js",hex_mode)
        if (this.gameBoard.markField(name, this.currentPlayer,hex_mode)) {
            this.winCheck();
            this.switchPlayer();
        }
        this.paintMove(name,true,hex_mode);
    }
}

export { Game };
