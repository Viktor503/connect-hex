const { BaseModel } = require("./base_model");

class randomModel extends BaseModel {
    predict(gameState) {
        console.log(gameState);
        console.log("predicting");
        if (this.hexMode) {
            let x = this.randomInt(gameState.length);
            let y = this.randomInt(gameState[0].length);
            while (gameState[x][y] != 0) {
                x = this.randomInt(gameState.length);
                y = this.randomInt(gameState[0].length);
            }
            console.log("loopdy loop is over but hex");
            return [x, y];
        } else {
            let usable_collumns = [];
            for (let i = 0; i < gameState.length * 2 - 1; i++) {
                const coords = this.columnToCoordinate(i + 1, gameState);
                console.log(`coords x:${coords[0]} y:${coords[1]}`);
                if (gameState[coords[0]][coords[1]] === 0) {
                    usable_collumns.push(i + 1);
                    console.log(`${i + 1} pushed`);
                }
            }
            console.log(usable_collumns);
            console.log("loopdy loop is over");
            let x = this.randomColumn(usable_collumns);
            console.log(`${x}, ${this.columnToCoordinate(x, gameState)}`);
            return this.columnToCoordinate(x, gameState);
        }
    }
}

module.exports = { randomModel };
