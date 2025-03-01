import { Hexagon_field } from "./Hexagon.js";
class GameBoard {
    constructor(boardsize, hexsize, material) {
        this.size = boardsize;
        let first_field_pos = { x: 0, y: (boardsize - 1) * (1 / 2) * hexsize, z: 0 };
        this.board = new Array(boardsize);
        for (let i = 0; i < boardsize; i++) {
            if (i != 0) {
                first_field_pos.x -= (7 / 8) * hexsize;
                first_field_pos.y -= (1 / 2) * hexsize;
                first_field_pos.z = 0;
            }
            this.board[i] = new Array(boardsize);
            for (let j = 0; j < boardsize; j++) {
                let field_pos = {
                    x: first_field_pos.x + (7 / 8) * hexsize * j,
                    y: first_field_pos.y - (1 / 2) * hexsize * j,
                    z: first_field_pos.z,
                };
                //print field_pos as string
                this.board[i][j] = new Hexagon_field(
                    0,
                    hexsize,
                    material,
                    field_pos,
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
        let diagonal_value = x - y;
        let diagonal = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (i - j == diagonal_value && this.board[i][j].value == 0) {
                    diagonal.push(this.board[i][j]);
                }
            }
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

    async flashFields(fieldsPositions, color, default_color) {
        return new Promise((resolve) => {
            setTimeout(async () => {
                for (let index = 0; index < 3; index++) {
                    console.log("index", index);

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

    markField(name, player) {
        let field = this.getNextEmptyFieldInDiagonal(name);
        if (!field) return;
        field.value = player == 1 ? 1 : -1;
        field.material.color.setHex(player == 1 ? 0xff0000 : 0x0000ff);
        return true;
    }
}

export { GameBoard };
