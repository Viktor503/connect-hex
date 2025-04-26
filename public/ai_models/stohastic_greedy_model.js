const { Queue } = require("../models/Queue");
const { greedyModel } = require("./greedy_model");

class greedyModelStochastic extends greedyModel {
    bestFieldFromDistanceTable(distanceTable, gameState, playerFields) {
        let min_dist = gameState.length ** 2;
        let min_field = [];

        for (const field in distanceTable) {
            const coord = this.fieldName_to_listCoord(field);
            if (this.isStartEdge(coord[0], coord[1])) {
                if (distanceTable[field]["dist"] < min_dist) {
                    min_dist = distanceTable[field]["dist"];
                    min_field = [];
                    min_field.push({
                        [field]: distanceTable[field],
                    });
                } else if (distanceTable[field]["dist"] == min_dist) {
                    min_field.push({
                        [field]: distanceTable[field],
                    });
                }
            }
        }

        const picked_dest = min_field[this.randomInt(min_field.length)];

        if (Object.keys(picked_dest).length === 0) {
            throw new Error("Didn't find optimal field");
        }
        let best_field;
        if (Object.values(picked_dest)[0]["dist"] > 1) {
            best_field = this.backtrackFieldFromDistanceTable(
                distanceTable,
                gameState,
                Object.values(picked_dest)[0],
                Object.keys(picked_dest)[0],
            );
        } else {
            best_field = Object.keys(picked_dest)[0];
        }
        return this.fieldName_to_listCoord(best_field);
    }
}
module.exports = { greedyModelStochastic };
