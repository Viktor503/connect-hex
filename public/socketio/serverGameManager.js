const { Queue } = require("./Queue");

function getPlayerFields(player, board) {
    let playerFields = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (
                (board[i][j] == 1 && player == 1) ||
                (board[i][j] == -1 && player == 2)
            ) {
                playerFields.push([i, j]);
            }
        }
    }
    return playerFields;
}

function validField(x, y, board_size) {
    return x >= 0 && x < board_size && y >= 0 && y < board_size;
}
function returnNeighbours(i, j) {
    let neighbours = [
        [i - 1, j - 1],
        [i - 1, j],
        [i, j - 1],
        [i, j + 1],
        [i + 1, j],
        [i + 1, j + 1],
    ];
    return neighbours;
}

function bfsToGetReachableFields(player_fields, player, board) {
    let queue = new Queue();

    let visited = new Set();
    queue.enqueue(player_fields[0]);

    while (queue.length() > 0) {
        let [i, j] = queue.dequeue();
        let vertexName = i + "," + j;
        if (!(vertexName in visited)) {
            visited.add(vertexName);
            let neighbours = returnNeighbours(i, j);
            neighbours.forEach((neighbour) => {
                let [x, y] = neighbour;
                let neighbourName = x + "," + y;
                if (
                    validField(x, y, board.length) &&
                    board[x][y] == (player == 1 ? 1 : -1) &&
                    !visited.has(neighbourName)
                ) {
                    queue.enqueue(neighbour);
                }
            });
        }
    }
    return visited;
}

function isStartEdge(x, y, player) {
    return (x == 0 && player == 1) || (y == 0 && player == 2);
}
function isEndEdge(x, y, player, board_size) {
    return (
        (x == board_size - 1 && player == 1) ||
        (y == board_size - 1 && player == 2)
    );
}

function checkIfFieldsAreWinning(player_fields, player, board) {
    let startEdgeFound = false;
    let endEdgeFound = false;
    player_fields.forEach((field) => {
        let [i, j] = field;
        startEdgeFound = startEdgeFound || isStartEdge(i, j, player);
        endEdgeFound = endEdgeFound || isEndEdge(i, j, player, board.length);
    });
    if (startEdgeFound && endEdgeFound) {
        return true;
    }
}

function winCheck(player, board) {
    let playerFields = getPlayerFields(player, board);

    // console.log("Player fields:", playerFields);
    // console.log("Player:", player);
    // console.log("Board:", board);
    while (playerFields.length > 0) {
        let playerVisitedSetStrings = bfsToGetReachableFields(
            playerFields,
            player,
            board,
        );

        let playerVisitedFields = Array.from(playerVisitedSetStrings).map(
            (field) => field.split(",").map((x) => parseInt(x)),
        );
        // console.log("Visited by player strings:", playerVisitedSetStrings);
        // console.log("Visited by player fields:", playerVisitedFields);
        if (checkIfFieldsAreWinning(playerVisitedFields, player, board)) {
            return { winner: true, fields: playerVisitedFields };
        }
        playerFields = playerFields.filter(
            (field) => !playerVisitedSetStrings.has(field[0] + "," + field[1]),
        );
    }
    return { winner: false, fields: [] };
}

function randstr() {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase(); // Get exactly 6 characters starting after "0."

    return random;
}

function differenceBetweenArrays(arr1, arr2) {
    let dif = 0;
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr1[i].length; j++) {
            if (arr1[i][j] !== arr2[i][j]) {
                dif += 1;
            }
        }
    }

    return dif;
}

function beginnerGameState(size) {
    gameState = new Array(size);
    for (let i = 0; i < size; i++) {
        gameState[i] = new Array(size);
        for (let j = 0; j < size; j++) {
            gameState[i][j] = 0;
        }
    }
    return gameState;
}

module.exports = {
    winCheck,
    getPlayerFields,
    bfsToGetReachableFields,
    validField,
    returnNeighbours,
    isStartEdge,
    isEndEdge,
    checkIfFieldsAreWinning,
    randstr,
    differenceBetweenArrays,
    beginnerGameState,
};
