import { Hexagon_field } from "./Hexagon.js";
class GameBoard {
    constructor(size, hexsize, material) {
        this.size = size;
        let first_field_pos = { x: 0, y: (size - 1) * (1 / 2) * hexsize, z: 0 };
        this.board = new Array(size);
        for (let i = 0; i < size; i++) {
            if (i != 0) {
                first_field_pos.x -= (7 / 8) * hexsize;
                first_field_pos.y -= (1 / 2) * hexsize;
                first_field_pos.z = 0;
            }
            this.board[i] = new Array(size);
            for (let j = 0; j < size; j++) {
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
    }
}

export { GameBoard };
