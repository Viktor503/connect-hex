const { Queue } = require("../models/Queue");
const { BaseModel } = require("./baseModel");

class greedyModel extends BaseModel {
    predict(gameState) {
        let playerFields = this.getPlayerFields(gameState);

        const distanceTable = this.greedybfs(gameState);
        return this.bestFieldFromDistanceTable(
            distanceTable,
            gameState,
            playerFields,
        );
    }

    emptyFieldsUnderField(x, y, gameState) {
        let fields_under = this.fieldsUnderfield(x, y, gameState);
        return fields_under.filter((field) => {
            if (gameState[field[0]][field[1]] == 0) {
                return true;
            }
            return false;
        });
    }

    getNewDist(path, under, x, y, gameState, prevDist) {
        let pathCoord = this.fieldName_to_listCoord(path);
        let pathInUnder = false;
        let pathInAbove = false;

        if (!this.hexMode) {
            //Get if path is somewhere under this field
            for (let i = 0; i < under.length; i++) {
                const coordUnder = under[i];
                if (
                    coordUnder[0] == pathCoord[0] &&
                    coordUnder[1] == pathCoord[1]
                ) {
                    pathInUnder = true;
                    break;
                }
            }

            //Get if path is above this field
            if (!pathInUnder) {
                let above = this.FieldsAboveField(x, y, gameState);
                for (let i = 0; i < above.length; i++) {
                    const coordAbove = above[i];
                    if (
                        coordAbove[0] == pathCoord[0] &&
                        coordAbove[1] == pathCoord[1]
                    ) {
                        pathInAbove = true;
                        break;
                    }
                }
            }
        }
        const dist = Math.max(
            0,
            prevDist +
                (gameState[x][y] == (this.playerOrder == 1 ? -1 : 1) ? 0 : 1) +
                (!this.hexMode && under.length > 0 ? 1 : 0) -
                (!this.hexMode && (pathInUnder || pathInAbove) ? 1 : 0),
        );
        return dist;
    }

    greedybfs(gameState) {
        let distanceTable = {};
        //Initialize the distance table
        for (let i = 0; i < gameState.length; i++) {
            //Don't care about field occupied by opponent
            for (let j = 0; j < gameState[0].length; j++) {
                if (gameState[i][j] == (this.playerOrder == 1 ? 1 : -1))
                    continue;
                const fieldName = `${i},${j}`;
                distanceTable[fieldName] = {};
                //Init starting fields with distance 0

                if (this.isEndEdge(i, j, gameState)) {
                    distanceTable[fieldName]["dist"] =
                        gameState[i][j] == (this.playerOrder == 1 ? -1 : 1)
                            ? 0
                            : 1;
                    distanceTable[fieldName]["path"] = fieldName;
                } else {
                    distanceTable[fieldName]["dist"] = -1;
                    distanceTable[fieldName]["path"] = "-";
                }
                if (!this.hexMode) {
                    distanceTable[fieldName]["under"] =
                        this.emptyFieldsUnderField(i, j, gameState);
                }
            }
        }
        let queue = new Queue();
        let visited = new Set();

        //Add starting fields to queue
        for (let i = 0; i < gameState.length; i++) {
            if (this.playerOrder == 1) {
                if (
                    gameState[i][gameState.length - 1] !=
                    (this.playerOrder == 1 ? 1 : -1)
                )
                    queue.enqueue(
                        this.listCoord_to_fieldName([i, gameState.length - 1]),
                    );
            } else {
                if (
                    gameState[gameState.length - 1][i] !=
                    (this.playerOrder == 1 ? 1 : -1)
                )
                    queue.enqueue(
                        this.listCoord_to_fieldName([gameState.length - 1, i]),
                    );
            }
        }

        //main loop through queue
        while (queue.length() > 0) {
            let field = queue.dequeue();
            visited.add(field);
            let [i, j] = this.fieldName_to_listCoord(field);
            let neighbours = this.returnNeighbours(i, j);

            neighbours.forEach((neighbour_coords) => {
                let [x, y] = neighbour_coords;
                let neighbour = this.listCoord_to_fieldName(neighbour_coords);

                if (
                    this.validField(x, y, gameState) &&
                    gameState[x][y] != (this.playerOrder == 1 ? 1 : -1)
                ) {
                    const prevDist = distanceTable[field]["dist"];
                    const newDist = this.getNewDist(
                        field,
                        distanceTable[neighbour].under,
                        x,
                        y,
                        gameState,
                        prevDist,
                    );
                    if (
                        distanceTable[neighbour]["dist"] == -1 ||
                        newDist < distanceTable[neighbour]["dist"]
                    ) {
                        distanceTable[neighbour]["dist"] = newDist;
                        distanceTable[neighbour]["path"] = field;
                    }

                    if (!visited.has(neighbour)) {
                        queue.enqueue(neighbour);
                    }
                }
            });
        }
        //Remove unreachable fields
        for (const field in distanceTable) {
            if (distanceTable[field]["dist"] == -1) {
                delete distanceTable[field];
            }
        }
        return distanceTable;
    }

    backtrackFieldFromDistanceTable(distanceTable, gameState, row, despath) {
        let searchRow = row;
        let currentPath = despath;

        let rev_path = [this.fieldName_to_listCoord(despath)];
        let currentPathCoord = this.fieldName_to_listCoord(currentPath);
        //get the shortest path
        while (
            !this.isEndEdge(currentPathCoord[0], currentPathCoord[1], gameState)
        ) {
            if (searchRow["under"] && searchRow["under"].length > 0) {
                searchRow["under"].forEach((element) => {
                    rev_path.push(element);
                });
                currentPath = this.listCoord_to_fieldName(
                    searchRow["under"][searchRow["under"].length - 1],
                );
                searchRow = distanceTable[currentPath];
            } else {
                rev_path.push(this.fieldName_to_listCoord(searchRow["path"]));
                currentPath = searchRow["path"];
                searchRow = distanceTable[searchRow["path"]];
            }
            currentPathCoord = this.fieldName_to_listCoord(currentPath);
        }
        //Find first element which isn't claimed
        for (let i = rev_path.length - 1; i > 0; i--) {
            if (gameState[rev_path[i][0]][rev_path[i][1]] == 0) {
                currentPath = this.listCoord_to_fieldName(rev_path[i]);
                break;
            }
        }

        return currentPath;
    }

    bestFieldFromDistanceTable(distanceTable, gameState, playerFields) {
        let min_dist = gameState.length ** 2;
        let min_field = {};

        for (const field in distanceTable) {
            const coord = this.fieldName_to_listCoord(field);
            if (this.isStartEdge(coord[0], coord[1])) {
                if (distanceTable[field]["dist"] < min_dist) {
                    min_dist = distanceTable[field]["dist"];
                    min_field = { [field]: distanceTable[field] };
                }
            }
        }

        if (Object.keys(min_field).length === 0) {
            throw new Error("Didn't find optimal field");
        }
        let best_field;
        if (Object.values(min_field)[0]["dist"] > 1) {
            best_field = this.backtrackFieldFromDistanceTable(
                distanceTable,
                gameState,
                Object.values(min_field)[0],
                Object.keys(min_field)[0],
            );
        } else {
            best_field = Object.keys(min_field)[0];
        }
        return this.fieldName_to_listCoord(best_field);
    }
}
module.exports = { greedyModel };
