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

    //Returns a random number between 0 and max-1
    randomInt(max) {
        return Math.floor(Math.random() * max);
    }

    //Returns a random element of the
    randomColumn(possible_collumns) {
        return possible_collumns[this.randomInt(possible_collumns.length)];
    }

    //Gets a column and returns the top mos coordinate
    columnToCoordinate(column, gameState) {
        // c = y - x + n
        // We can set y to be zero and we know n, so we can get a coordinate to mark
        // y = c - n
        const n = gameState.length;
        if (column > n) {
            return [0, column - n];
        } else {
            return [n - column, 0];
        }
    }

    validField(x, y, gameState) {
        return x >= 0 && x < gameState.length && y >= 0 && y < gameState.length;
    }

    isStartEdge(x, y) {
        return (
            (x == 0 && this.playerOrder == 2) ||
            (y == 0 && this.playerOrder == 1)
        );
    }
    isEndEdge(x, y, gameState) {
        return (
            (x == gameState.length - 1 && this.playerOrder == 2) ||
            (y == gameState.length - 1 && this.playerOrder == 1)
        );
        0 / game / ai;
    }

    getPlayerFields(gameState) {
        let player_fields = [];
        for (let i = 0; i < gameState.length; i++) {
            for (let j = 0; j < gameState.length; j++) {
                if (gameState[i][j] == (this.playerOrder == 1 ? -1 : 1)) {
                    player_fields.push([i, j]);
                }
            }
        }
        return player_fields;
    }

    fieldName_to_listCoord(fieldName) {
        return fieldName.split(",").map((x) => parseInt(x));
    }

    listCoord_to_fieldName(listCoord) {
        return `${listCoord[0]},${listCoord[1]}`;
    }

    edgeFieldsInPlayerFields(playerFields, gameState) {
        let startfield = false;
        let endfield = false;
        for (let i = 0; i < playerFields.length; i++) {
            if (this.isStartEdge(playerFields[i][0], playerFields[i][1]))
                startfield = true;
            if (
                this.isEndEdge(
                    playerFields[i][0],
                    playerFields[i][1],
                    gameState,
                )
            )
                endfield = true;
        }
        return [startfield, endfield];
    }
}
module.exports = { BaseModel };
