const { BaseModel } = require("./baseModel.js");
class greedyModelErdosSelfridge extends BaseModel {
    predict(gameState) {
        if (this.hexMode) {
            let [x, y] = this.fieldName_to_listCoord(
                this.getmaxField(gameState, 10000),
            );
            console.log("x: " + x + " y: " + y);
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

    findPathsOfLength(minPathLength, isGoal, gamState, maxPaths = 10000) {
        // Get all the start fields they have coordinates [0, anything]
        const startFields = [];
        for (let i = 0; i < gamState.length; i++) {
            if (gamState[0][i] === 0 || gamState[0][i] === 1) {
                startFields.push([0, i]);
            }
        }
        const foundPaths = new Set();
        for (const start of startFields) {
            const paths = this.findPathsOfLengthfromStart(
                start,
                minPathLength,
                isGoal,
                gamState,
                Math.floor(maxPaths / startFields.length),
            );
            for (let pathSet of paths) {
                let normalized = Array.from(pathSet).sort().join("|");
                foundPaths.add(normalized);
            }
        }
        return foundPaths;
    }

    findPathsOfLengthfromStart(
        start,
        minPathLength,
        isGoal,
        gameState,
        maxPaths = 10000,
    ) {
        const foundPaths = [];
        const queue = [
            {
                cell: start,
                path: [start],
                visited: new Set([this.listCoord_to_fieldName(start)]),
            },
        ];

        while (queue.length > 0 && foundPaths.length < maxPaths) {
            const { cell, path, visited } = queue.shift();

            if (path.length >= minPathLength) {
                if (isGoal(cell)) {
                    let stringpath = path.map((coord) =>
                        this.listCoord_to_fieldName(coord),
                    );
                    foundPaths.push(new Set(stringpath));

                    continue;
                }
            }

            const neighbors = this.returnvalidNeighbours(
                cell[0],
                cell[1],
                gameState,
            );
            for (const neighbor of neighbors) {
                const neighborStr = this.listCoord_to_fieldName(neighbor);
                if (!visited.has(neighborStr)) {
                    const newVisited = new Set(visited);
                    newVisited.add(neighborStr);

                    queue.push({
                        cell: neighbor,
                        path: [...path, neighbor],
                        visited: newVisited,
                    });
                }
            }
        }

        return foundPaths;
    }

    getFieldWeights(gameState, sample = 10000) {
        let fieldWeights = {};

        let isGoal = (cell) => {
            return cell[0] === gameState.length - 1;
        };

        this.findPathsOfLength(
            gameState.length - 1,
            isGoal,
            gameState,
            sample,
        ).forEach((path) => {
            let pathlist = path.split("|");
            const playerFields_inPath = pathlist.filter((field) => {
                let fieldcoords = this.fieldName_to_listCoord(field);
                return gameState[fieldcoords[0]][fieldcoords[1]] === 1;
            });

            const weight = 2 ** (-pathlist.length + playerFields_inPath.length);

            for (let i = 0; i < pathlist.length; i++) {
                const fieldName = pathlist[i];
                if (fieldWeights[fieldName]) {
                    fieldWeights[fieldName] += weight;
                } else {
                    fieldWeights[fieldName] = weight;
                }
            }
        });
        return fieldWeights;
    }

    getmaxField(gameState, sample) {
        const fieldWeights = this.getFieldWeights(gameState, sample);
        console.log(fieldWeights);
        let maxWeight = -1;
        let maxField = null;

        for (const field in fieldWeights) {
            let [x, y] = this.fieldName_to_listCoord(field);
            if (fieldWeights[field] > maxWeight && gameState[x][y] === 0) {
                maxWeight = fieldWeights[field];
                maxField = field;
            }
        }
        if (maxField === null) {
            throw new Error("No valid field found");
        }
        return maxField;
    }
}

module.exports = { greedyModelErdosSelfridge };
