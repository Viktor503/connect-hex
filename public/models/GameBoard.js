import { hexagonField } from "./Hexagon.js";
class GameBoard {
    constructor(boardsize, hexsize, material) {
        this.size = boardsize;
        let first_field_pos = {
            x: 0,
            y: (boardsize - 1) * (1 / 2) * hexsize,
            z: 0,
        };
        this.board = new Array(boardsize);
        for (let i = 0; i < boardsize; i++) {
            if (i != 0) {
                first_field_pos.x -= (Math.sqrt(3) / 2) * hexsize;
                first_field_pos.y -= (1 / 2) * hexsize;
                first_field_pos.z = 0;
            }
            this.board[i] = new Array(boardsize);
            for (let j = 0; j < boardsize; j++) {
                let field_pos = {
                    x: first_field_pos.x + (Math.sqrt(3) / 2) * hexsize * j,
                    y: first_field_pos.y - (1 / 2) * hexsize * j,
                    z: first_field_pos.z,
                };
                //get side
                let side = null;
                if (i == 0 && j == 0) {
                    side = "N";
                } else if (i == 0 && j == boardsize - 1) {
                    side = "E";
                } else if (i == boardsize - 1 && j == boardsize - 1) {
                    side = "S";
                } else if (i == boardsize - 1 && j == 0) {
                    side = "W";
                } else if (i == 0) {
                    side = "NE";
                } else if (j == boardsize - 1) {
                    side = "SE";
                } else if (i == boardsize - 1) {
                    side = "SW";
                } else if (j == 0) {
                    side = "NW";
                }

                //print field_pos as string
                this.board[i][j] = new hexagonField(
                    0,
                    hexsize,
                    material,
                    field_pos,
                    side,
                );
                this.board[i][j].createHexagon();
                this.board[i][j].mesh.name = i + "," + j;
            }
        }
    }

    getBoard() {
        return this.board;
    }

    getBoardValues() {
        let board = [];
        this.board.forEach((row) => {
            let row_values = [];
            row.forEach((field) => {
                row_values.push(field.value);
            });
            board.push(row_values);
        });
        return board;
    }

    getPlayerFields(player) {
        let player_fields = [];
        let valueBoard = this.getBoardValues();
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (valueBoard[i][j] == (player == 1 ? 1 : -1)) {
                    player_fields.push([i, j]);
                }
            }
        }
        return player_fields;
    }

    printBoard() {
        let board = this.getBoardValues();
        board.forEach((row) => {
            console.log(row);
        });
    }

    addToScene(scene) {
        this.board.forEach((row) => {
            row.forEach((field) => {
                scene.add(field.mesh);
            });
        });
    }

    getCoordinatesFromName(name) {
        let [x, y] = name.split(",");
        return [parseInt(x), parseInt(y)];
    }

    getDiagonalElements(name) {
        let [x, y] = this.getCoordinatesFromName(name);
        let diagonal = [];
        let column = y - x;
        x = 0;
        y = 0;
        if (column > 0) {
            y += column;
        } else {
            x -= column;
        }
        while (this.board[x][y].value == 0) {
            diagonal.push(this.board[x][y]);
            x++;
            y++;
            if (x > this.size - 1 || y > this.size - 1) break;
        }
        return diagonal;
    }

    getNextEmptyFieldInDiagonal(name) {
        let diagonal = this.getDiagonalElements(name);
        if (diagonal.length == 0) return null;
        return diagonal[diagonal.length - 1];
    }

    changeDiagonalColor(name, color, colorForNextEmpty) {
        let diagonals = this.getDiagonalElements(name);
        if (diagonals.length == 0) return;
        diagonals.slice(0, -1).forEach((field) => {
            field.material.color.setHex(color);
        });
        diagonals[diagonals.length - 1].material.color.setHex(
            colorForNextEmpty,
        );
    }

    changeFieldColor(name, color) {
        let [x, y] = this.getCoordinatesFromName(name);
        if (this.board[x][y].value == 0) {
            this.board[x][y].material.color.setHex(color);
        }
    }

    async flashFields(fieldsPositions, color, default_color) {
        return new Promise((resolve) => {
            setTimeout(async () => {
                for (let index = 0; index < 3; index++) {
                    fieldsPositions.forEach((field) => {
                        this.board[field[0]][field[1]].material.color.setHex(
                            default_color,
                        );
                    });
                    await this.sleep(500);
                    fieldsPositions.forEach((field) => {
                        this.board[field[0]][field[1]].material.color.setHex(
                            color,
                        );
                    });
                    await this.sleep(500);
                }
                resolve();
            }, 100);
        });
    }

    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    loadgameState(gameState) {
        for (let x = 0; x < gameState.length; x++) {
            for (let y = 0; y < gameState[0].length; y++) {
                this.board[x][y].value = gameState[x][y];
                switch (gameState[x][y]) {
                    case 1:
                        this.board[x][y].material.color.setHex(0xff0000);
                        break;
                    case -1:
                        this.board[x][y].material.color.setHex(0x0000ff);
                        break;
                    default:
                        this.board[x][y].material.color.setHex(0xffffff);
                        break;
                }
            }
        }
    }

    markField(name, player, hex_mode) {
        let field;
        if (hex_mode) {
            let [x, y] = this.getCoordinatesFromName(name);
            field = this.getBoardValues()[x][y] == 0 ? this.board[x][y] : null;
        } else {
            field = this.getNextEmptyFieldInDiagonal(name);
        }
        if (!field) return;
        field.value = player == 1 ? 1 : -1;
        field.material.color.setHex(player == 1 ? 0xff0000 : 0x0000ff);

        return true;
    }
}

export { GameBoard };
