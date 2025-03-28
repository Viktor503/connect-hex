var socket = io(window.location.origin);
let gameId = null;
game = window.game;
let currentPlayer = 1;

function writePlayerListGui(players) {
    players_info = document.getElementById("players_info");
    players_info.innerHTML = "";

    const playerOne = Object.entries(players).find(
        ([key, value]) => value === 1,
    );
    const playerTwo = Object.entries(players).find(
        ([key, value]) => value === 2,
    );

    console.log(playerOne, playerTwo);
    console.log(socket.id);
    console.log(socket.id == playerOne[0], socket.id == playerTwo[0]);
    console.log(currentPlayer);
    // Create the bold red span
    const player1 = document.createElement("span");
    player1.textContent = `player1${socket.id == playerOne[0] ? " (you)" : ""}`;

    const player2 = document.createElement("span");
    player2.textContent = `player2${socket.id == playerTwo[0] ? " (you)" : ""}`;

    console.log(player1, player2);

    if (currentPlayer == 1) player1.style.fontWeight = "bold"; // Make it bold
    if (currentPlayer == 2) player2.style.fontWeight = "bold"; // Make it bold

    if (playerOne[1] == 1) {
        player1.style.color = "red";
        player2.style.color = "RoyalBlue";
    } else {
        player1.style.color = "RoyalBlue";
        player2.style.color = "red";
    }

    const br = document.createElement("br");

    // Append both spans to the paragraph
    players_info.appendChild(player1);
    players_info.appendChild(br);
    players_info.appendChild(player2);
}

function createGame() {
    let board_size = document.getElementById("board_size_online").value;
    let hex_mode = document.getElementById("hex_mode_online").checked;
    let player_order;

    document.getElementsByName("player_order").forEach((element) => {
        if (element.checked) player_order = element.value;
    });

    let gameConfig = {
        board_size: board_size,
        hex_mode: hex_mode,
        player_order: player_order,
    };
    socket.emit("createGame", gameConfig);
}
function joinGame() {
    let gameId = document.getElementById("game_id").value;
    payload = { game_id: gameId };
    console.log("*********************");
    console.log("joinGame", payload);
    console.log("*********************");
    socket.emit("joinRoom", gameId);
}

function gameMove(move) {
    console.log(`emitting move ${move}`);
    socket.emit("gameMove", {
        roomId: roomIdFromUrl,
        move: move,
        gameState: game.gameBoard.getBoardValues(),
    });
    socket.emit("wincheck", {
        roomId: roomIdFromUrl,
        player: currentPlayer,
    });
    currentPlayer = currentPlayer == 1 ? 2 : 1;
    writePlayerListGui(players);
}

socket.on("connect", () => {
    console.log(`You connected with id ${socket.id}`);
});
socket.on("joinRoom", (data) => {
    console.log(`Joined room ${data["roomId"]}`);
    document.getElementById("waiting-message-text").innerHTML =
        "Waiting for player 2";

    // game.currentPlayer = data.order;
});

socket.on("gameCreated", (data) => {
    let url = `${window.location.origin}/game/${data["roomId"]}`;

    window.location.replace(url);
});

let players;
socket.on("playersConnected", (data) => {
    // Hide waiting message
    document.getElementById("waiting-message").style.display = "none";

    // Show game container
    document.getElementById("game-container").style.display = "block";
    console.log("players connected");
    console.log(data.players);
    players = data.players;

    // Start the game
    if (typeof window.startGame === "function") {
        window.startGame();
    }
    writePlayerListGui(players);

    console.log("game is starting now");
});

let order;
socket.on("playerOrder", (data) => {
    order = data.order;
});

socket.on("gameRestarted", (data) => {
    currentPlayer = 1;
    game.loadgameState(data.gameState);
    players = data.players;
    console.log(game.winner);
    game.winner = null;
    writePlayerListGui(players);
});

socket.on("gameOver", async (data) => {
    game.winner = data.winner;
    await game.gameBoard
        .flashFields(
            data.fields,
            data.winner == 1 ? 0xff0000 : 0x0000ff,
            0xffffff,
        )
        .then(() => {
            if (
                confirm(
                    "Player " +
                        data.winner +
                        " wins!\nDo you want to play again?",
                )
            ) {
                socket.emit("restartGame", { roomId: roomIdFromUrl });
            } else {
                window.location.replace(window.location.origin);
            }
        });
});

socket.on("gameUpdate", (data) => {
    console.log(`enemy made move ${data.move} ${data.hex_mode}`);
    currentPlayer = currentPlayer == 1 ? 2 : 1;

    game.loadgameState(data.gameState);
    game.currentPlayer = data.currentPlayer;

    writePlayerListGui(players);
});

socket.on("gameStateError", (data) => {
    game.loadgameState(data.gameState);
    currentPlayer = currentPlayer == 1 ? 2 : 1;
    writePlayerListGui(players);
    console.log("----------------GAME STATE ERROR------------------");
    console.log(data.message);
    console.log(data.gameState);
});

socket.on("opponentDisconnect", () => {
    alert(
        `Your opponent has disconnected!\n${game.winner ? "" : "Congratulations for your win! :D"}`,
    );
    window.location.replace(window.location.origin);
});

let error = "";
socket.on("error", (data) => {
    error = data;
    console.log("----------------ERROR------------------");
    console.log(error);
    document.getElementById("waiting-message-text").innerHTML = error;
});

let current_url = window.location.href;
let roomIdFromUrl;

let re = new RegExp(window.location.origin + "/game/room-[\\w]{6}");
if (re.test(current_url)) {
    roomIdFromUrl = current_url.split("/game")[1].slice(1);
    socket.emit("joinRoom", { gameId: roomIdFromUrl });
}
