const { BaseModel } = require("./base_model");

class randomModel extends BaseModel {
    predict(gameState) {
        if (this.hexMode) {
            let x = this.randomInt(gameState.length);
            let y = this.randomInt(gameState[0].length);
            while (gameState[x][y] != 0) {
                x = this.randomInt(gameState.length);
                y = this.randomInt(gameState[0].length);
            }
            return [x, y];
        } else {
            let usable_collumns = [];
            for (let i = 0; i < gameState.length * 2 - 1; i++) {
                const coords = this.columnToCoordinate(i + 1, gameState);
                if (gameState[coords[0]][coords[1]] === 0) {
                    usable_collumns.push(i + 1);
                }
            }
            let x = this.randomColumn(usable_collumns);
            return this.columnToCoordinate(x, gameState);
        }
    }
}

module.exports = { randomModel };
