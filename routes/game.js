const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    res.render("game", {
        board_size: req.body.board_size,
        hex_mode: req.body.hex_mode,
    });
});

router.get("/:id", async (req, res) => {
    const roomId = req.params.id;
    const roomInfo = req.socketManager.getRoomInfo(roomId);
    if (roomInfo) {
        console.log(roomInfo);
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
