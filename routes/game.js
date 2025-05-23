const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    const board_size = +req.body.board_size;
    if (isNaN(board_size) || board_size <= 1 || board_size > 15) {
        res.cookie(
            "error",
            "Invalid board size. Please choose a number between 1 and 15.",
        );
        return res.redirect("/");
    }

    res.render("game", {
        board_size: req.body.board_size,
        hex_mode: req.body.hex_mode,
    });
});

router.post("/ai", async (req, res) => {
    const board_size = +req.body.board_size_ai;
    if (isNaN(board_size) || board_size <= 1 || board_size > 15) {
        res.cookie(
            "error",
            "Invalid board size. Please choose a number between 1 and 15.",
        );
        return res.redirect("/");
    }
    if (
        req.body.player_order_ai != "me" &&
        req.body.player_order_ai != "opponent" &&
        req.body.player_order_ai != "random"
    ) {
        res.cookie(
            "error",
            "Invalid player order. Please choose 'me', 'opponent' or 'random'.",
        );
        return res.redirect("/");
    }
    if (
        req.body.model != "random" &&
        req.body.model != "greedy" &&
        req.body.model != "stohastic_greedy" &&
        req.body.model != "greedy_erdos-selfridge" &&
        req.body.model != "odd_empty_right" &&
        req.body.model != "odd_empty_left"
    ) {
        res.cookie(
            "error",
            "Invalid model. Please choose 'random', 'greedy', 'stohastic_greedy', 'greedy_erdos-selfridge', 'odd_empty_righ' or 'odd_empty_left'.",
        );
        return res.redirect("/");
    }

    let player_order;
    if (req.body.player_order_ai == "me") {
        player_order = 1;
    } else if (req.body.player_order_ai == "opponent") {
        player_order = 2;
    } else {
        player_order = Math.floor(Math.random() * 2) + 1;
    }
    ai_order = player_order === 1 ? 2 : 1;
    res.render("game_ai", {
        board_size: req.body.board_size_ai,
        hex_mode: req.body.hex_mode_ai,
        player_order: player_order,
        ai_model: req.body.model,
    });
});

module.exports = router;

router.get("/:id", async (req, res) => {
    const roomId = req.params.id;
    const roomInfo = req.socketManager.getRoomInfo(roomId);
    if (roomInfo) {
        res.render("game_online", roomInfo["gameConfig"]);
    } else {
        res.cookie("error", "Invalid room ID. Please choose a valid room ID.");
        return res.redirect("/");
    }
});

module.exports = router;
