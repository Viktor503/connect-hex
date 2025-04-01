const { BaseModel } = require("./base_model");

class randomModel extends BaseModel {
    constructor(playerOrder, hexMode) {
        super(playerOrder, hexMode);
    }

    predict(gameState) {
        console.log("predicting");
        if (this.hexMode) {
            let x = Math.floor(Math.random() * gameState.length);
            let y = Math.floor(Math.random() * gameState.length);
            while (gameState[x][y] != 0) {
                x = Math.floor(Math.random() * gameState.length);
                y = Math.floor(Math.random() * gameState.length);
            }
            return [x, y];
        } else {
            let x = Math.floor(Math.random() * gameState.length);
            while (gameState[x][0] != 0)
                x = Math.floor(Math.random() * gameState.length);
            return [x, 0];
        }
    }
}
module.exports = { randomModel };
