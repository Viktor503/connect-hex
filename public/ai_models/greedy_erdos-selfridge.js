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
            let usable_fields = [];
            for (let i = 0; i < gameState.length * 2 - 1; i++) {
                let coords = this.columnToCoordinate(i + 1, gameState);
                while (gameState[coords[0]][coords[1]] == 0) {
                    if (
                        coords[0] + 1 >= gameState.length ||
                        coords[1] + 1 >= gameState.length ||
                        gameState[coords[0] + 1][coords[1] + 1] != 0
                    ) {
                        break;
                    }
                    coords[0] += 1;
                    coords[1] += 1;
                }

                usable_fields.push(
                    this.listCoord_to_fieldName([coords[0], coords[1]]),
                );
            }
            let [x, y] = this.fieldName_to_listCoord(
                this.getmaxField(gameState, 10000, usable_fields),
            );
            console.log("x: " + x + " y: " + y);
            return [x, y];
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
                    let stringpath = new Set(
                        path.map((coord) => this.listCoord_to_fieldName(coord)),
                    );
                    foundPaths.push(stringpath);

                    continue;
                }
            }

            const neighbors = this.returnvalidNeighbours(
                cell[0],
                cell[1],
                gameState,
            );
            for (const neighbor of neighbors) {
                if (gameState[neighbor[0]][neighbor[1]] == -1) continue;

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

        let all_paths = this.findPathsOfLength(
            gameState.length - 1,
            isGoal,
            gameState,
            sample,
        );
        console.log();
        let absolutePotential = 0;
        all_paths.forEach((path) => {
            let pathlist = path.split("|");

            let nescessaryPosets = [];
            let emptyFieldsFromNescessaryPosets = [];
            if (!this.hexMode) {
                for (let i = 0; i < pathlist.length; i++) {
                    let coordsForField = this.fieldName_to_listCoord(
                        pathlist[i],
                    );
                    this.fieldsUnderfield(
                        coordsForField[0],
                        coordsForField[1],
                        gameState,
                    ).forEach((field) => {
                        nescessaryPosets.push(field);
                    });
                }
                emptyFieldsFromNescessaryPosets = nescessaryPosets.filter(
                    ([x, y]) => {
                        return gameState[x][y] == 0;
                    },
                );
            }

            const playerFields_inPath = pathlist.filter((field) => {
                let fieldcoords = this.fieldName_to_listCoord(field);
                return gameState[fieldcoords[0]][fieldcoords[1]] === 1;
            });

            const weight =
                2 **
                (-pathlist.length -
                    emptyFieldsFromNescessaryPosets.length +
                    playerFields_inPath.length);
            absolutePotential += weight;

            for (let i = 0; i < pathlist.length; i++) {
                const fieldName = pathlist[i];
                if (fieldWeights[fieldName]) {
                    fieldWeights[fieldName] += weight;
                } else {
                    fieldWeights[fieldName] = weight;
                }
            }
        });
        console.log("absolutePotential: " + absolutePotential);
        return fieldWeights;
    }

    getmaxField(gameState, sample, usable_fields = null) {
        const fieldWeights = this.getFieldWeights(gameState, sample);
        console.log(fieldWeights);
        let maxWeight = -1;
        let maxField = null;

        for (const field in fieldWeights) {
            let [x, y] = this.fieldName_to_listCoord(field);
            if (fieldWeights[field] > maxWeight && gameState[x][y] === 0) {
                if (usable_fields) {
                    if (usable_fields.includes(field)) {
                        maxWeight = fieldWeights[field];
                        maxField = field;
                    }
                } else {
                    maxWeight = fieldWeights[field];
                    maxField = field;
                }
            }
        }
        if (maxField === null) {
            throw new Error("No valid field found");
        }
        return maxField;
    }
}

module.exports = { greedyModelErdosSelfridge };
