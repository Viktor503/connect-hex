class BaseModel {
    constructor(playerOrder, hexMode) {
        this.playerOrder = playerOrder;
        this.hexMode = hexMode;
        if (this.constructor == BaseModel) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    predict(gameState) {
        throw new Error("Method 'say()' must be implemented.");
    }
}
module.exports = { BaseModel };
