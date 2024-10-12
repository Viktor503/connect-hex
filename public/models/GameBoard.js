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
}

export { GameBoard };
