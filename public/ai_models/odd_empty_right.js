const { BaseModel } = require("./baseModel");

class oddEmptyRight extends BaseModel {
    predict(gameState) {
        let possible_collumns = [];
        for (let i = 1; i < gameState.length * 2; i++) {
            const coords = this.columnToCoordinate(i, gameState);
            if (gameState[coords[0]][coords[1]] === 0) {
                possible_collumns.push(i);
            }
        }

        // Loop through the columns in reverse order
        // and check if the column has an odd number of empty fields
        // If it does, return the column
        for (let index = possible_collumns.length - 1; index >= 0; index--) {
            let column = possible_collumns[index];
            let fields = [];
            for (let i = 0; i < gameState.length; i++) {
                for (let j = 0; j < gameState[i].length; j++) {
                    if (
                        j - i + gameState.length == column &&
                        gameState[i][j] == 0
                    ) {
                        fields.push(gameState[i][j]);
                    }
                }
            }
            if (fields.length % 2 == 1) {
                return this.columnToCoordinate(column, gameState);
            }
        }
        // If no column has an odd number of empty fields, return the last column
        return this.columnToCoordinate(
            possible_collumns[possible_collumns.length - 1],
            gameState,
        );
    }
}

module.exports = { oddEmptyRight };
