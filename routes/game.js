const express = require("express");
const router = express.Router();
const GameClass = require("../models/Game");

router.post("/", async (req, res) => {
    let GameInstance = new GameClass(req.body.board_size);
    res.render("game", { board_size: req.body.board_size });
});

module.exports = router;
