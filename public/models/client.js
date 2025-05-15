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

    const player1 = document.createElement("span");
    player1.textContent = `player1${socket.id == playerOne[0] ? " (you)" : ""}`;

    const player2 = document.createElement("span");
    player2.textContent = `player2${socket.id == playerTwo[0] ? " (you)" : ""}`;

    if (currentPlayer == 1) player1.style.fontWeight = "bold";
    if (currentPlayer == 2) player2.style.fontWeight = "bold";

    if (playerOne[1] == 1) {
        player1.style.color = "red";
        player2.style.color = "RoyalBlue";
    } else {
        player1.style.color = "RoyalBlue";
        player2.style.color = "red";
    }

    const br = document.createElement("br");

    players_info.appendChild(player1);
    players_info.appendChild(br);
    players_info.appendChild(player2);
}

function createGame() {
    let board_size = +document.getElementById("board_size_online").value;
    let hex_mode = document.getElementById("hex_mode_online").checked;
    let player_order;

    document.getElementsByName("player_order").forEach((element) => {
        if (element.checked) player_order = element.value;
    });

    if (isNaN(board_size) || board_size <= 1 || board_size > 15) {
        document.cookie =
            "error=Invalid board size. Please choose a number between 1 and 15.";
        window.location.href = "/";
        return;
    }
    if (
        player_order != "me" &&
        player_order != "opponent" &&
        player_order != "random"
    ) {
        document.cookie =
            "error=Invalid player order. Please choose 'me', 'opponent' or 'random'.";
        window.location.href = "/";
    }
    if (hex_mode != true && hex_mode != false) {
        document.cookie =
            "error=Invalid hex mode. Please choose 'true' or 'false'.";
        window.location.href = "/";
    }

    let gameConfig = {
        board_size: board_size,
        hex_mode: hex_mode,
        player_order: player_order,
    };
    socket.emit("createGame", gameConfig);
}
function joinGame() {
    let gameId = document.getElementById("game_id").value;
    let url = `${window.location.origin}/game/${gameId}`;

    window.location.replace(url);
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

socket.on("joinRoom", (data) => {
    console.log(`Joined room ${data["roomId"]}`);
    document.getElementById("waiting-message-text").innerHTML =
        `Waiting for player 2!! <br/> Send them this link or the game code <b>${data["roomId"]}</b>`;
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
    alert(
        `----------------GAME STATE ERROR------------------\n${data.message}`,
    );
    console.log("reloading game state:", data.gameState);
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
    alert(`----------------ERROR------------------\n${error}`);
    window.location.replace(window.location.origin);
});

let current_url = window.location.href;
let roomIdFromUrl;

let re = new RegExp(window.location.origin + "/game/[\\w]{6}");
if (re.test(current_url)) {
    roomIdFromUrl = current_url.split("/game")[1].slice(1);
    socket.emit("joinRoom", { gameId: roomIdFromUrl });
}
