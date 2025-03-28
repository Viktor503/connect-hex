// socketManager.js

const {
    winCheck,
    randstr,
    differenceBetweenArrays,
    beginnerGameState,
} = require("./serverGameManager");

let io;
const gameRooms = {};
winCheck;

function getEnemyId(room, id) {
    // Get all player IDs (keys of the room.players object)
    const playerIds = Object.keys(room.players);

    // Find the enemy ID (the one that's not the current ID)
    if (id === playerIds[0]) {
        return playerIds[1];
    } else {
        return playerIds[0];
    }
}

// Initialize with the server instance
const initialize = (server) => {
    io = require("socket.io")(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("New connection:", socket.id);

        socket.on("createGame", (gameConfig) => {
            console.log(gameConfig);
            const roomId = randstr("room-");
            gameRooms[roomId] = {
                players: {},
                currentPlayer: 1,
                created: Date.now(),
                gameState: beginnerGameState(gameConfig.board_size),
                gameConfig: gameConfig,
            };
            socket.join(roomId);
            socket.emit("gameCreated", { roomId: roomId });
            console.log("created new game from app.js");
            console.log("rooms: %o", gameRooms);
        });

        socket.on("wincheck", (data) => {
            wincheckResponse = winCheck(
                data.player,
                gameRooms[data.roomId].gameState,
            );
            console.log(wincheckResponse);
            const winner = wincheckResponse["winner"];
            const fields = wincheckResponse["fields"];
            console.log("Winner:", winner);
            console.log("Fields:", fields);
            if (winner) {
                io.to(data.roomId).emit("gameOver", {
                    winner: data.player,
                    fields: fields,
                });
                console.log(`Player ${data.player} won the game`);
            }
        });

        // Handle a player joining a game room
        socket.on("joinRoom", (data) => {
            const roomId = data["gameId"];
            const room = gameRooms[roomId];
            if (room) {
                if (Object.keys(room.players).length >= 2) {
                    socket.emit("error", "Room is already full.");
                } else {
                    socket.join(roomId);
                    if (Object.keys(room.players).length == 0) {
                        if (room.gameConfig.player_order == "me") {
                            room.players[socket.id] = 1;
                        } else if (room.gameConfig.player_order == "opponent") {
                            room.players[socket.id] = 2;
                        } else {
                            room.players[socket.id] =
                                Math.floor(Math.random() * 2) + 1;
                        }
                    } else {
                        const firstPlayerId = Object.keys(room.players)[0];
                        const firstPlayerValue = room.players[firstPlayerId];

                        room.players[socket.id] =
                            firstPlayerValue === 1 ? 2 : 1;
                    }

                    console.log(`Player ${socket.id} joined room ${roomId}`);
                    socket.emit("joinRoom", {
                        roomId: roomId,
                    });
                    if (
                        Object.keys(room.players).length == 2 &&
                        !room["gameStarted"]
                    ) {
                        io.to(roomId).emit("playersConnected", {
                            players: room.players,
                        });
                        socket.emit("playerOrder", {
                            order: room.players[socket.id],
                        });
                        io.to(getEnemyId(room, socket.id)).emit("playerOrder", {
                            order: room.players[getEnemyId(room, socket.id)],
                        });
                    }
                    console.log("rooms: %o", gameRooms);
                }
            } else {
                console.log(roomId);
                socket.emit("error", "Room not found");
            }
        });

        // Handle disconnections
        socket.on("disconnect", () => {
            console.log("Player disconnected:", socket.id);
            for (const roomId in gameRooms) {
                if (
                    Object.keys(gameRooms[roomId].players).includes(
                        socket.id,
                    ) &&
                    Object.keys(gameRooms[roomId].players).length == 2
                ) {
                    io.to(getEnemyId(gameRooms[roomId], socket.id)).emit(
                        "opponentDisconnect",
                    );
                }
            }
        });

        socket.on("restartGame", (data) => {
            roomId = data.roomId;
            room = gameRooms[roomId];

            room.currentPlayer = 1;
            room.gameState = beginnerGameState(room.gameConfig.board_size);

            if (room.gameConfig.player_order == "random") {
                room.players[socket.id] = Math.floor(Math.random() * 2) + 1;
                room.players[getEnemyId(room, socket.id)] =
                    room.players[socket.id] == 1 ? 2 : 1;
            }

            io.to(roomId).emit("gameRestarted", {
                gameState: room.gameState,
                players: room.players,
            });
        });

        // Game-specific events would be handled here
        socket.on("gameMove", (data) => {
            const roomId = data.roomId;
            const gameState = data.gameState;
            room = gameRooms[roomId];
            if (room) {
                if (differenceBetweenArrays(room.gameState, gameState) != 1) {
                    socket.emit("gameStateError", {
                        message: "Invalid step please don't cheat",
                        gameState: room.gameState,
                    });
                } else if (room.players[socket.id] != room.currentPlayer) {
                    socket.emit("gameStateError", {
                        message: "Please wait for your turn to make a move",
                        gameState: room.gameState,
                    });
                } else {
                    room.gameState = gameState;
                    room.currentPlayer = room.currentPlayer == 1 ? 2 : 1;
                    console.log(room.currentPlayer);

                    console.log("other player", getEnemyId(room, socket.id));
                    // Broadcast move to everyone in the room except sender
                    io.to(getEnemyId(room, socket.id)).emit("gameUpdate", {
                        move: data.move,
                        hex_mode: room.gameConfig.hex_mode,
                        gameState: gameState,
                        currentPlayer: room.currentPlayer,
                    });
                }
            }
        });
    });
};

// Get room information
const getRoomInfo = (roomId) => {
    if (gameRooms[roomId]) return gameRooms[roomId];
    return null;
};

// Export functions and objects for use in other files
module.exports = {
    initialize,
    getRoomInfo,
    getIO: () => io,
    gameRooms,
};
