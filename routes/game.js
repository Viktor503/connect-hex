const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    res.render("game", {
        board_size: req.body.board_size,
        hex_mode: req.body.hex_mode,
    });
});

router.post("/ai", async (req, res) => {
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
        res.send("404");
    }
    // res.render("game", {
    //     board_size: req.body.board_size,
    //     hex_mode: req.body.hex_mode,
    //     room: req.body.room,
    // });
});

module.exports = router;
