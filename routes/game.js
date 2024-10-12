const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    res.render("game", { board_size: req.body.board_size });
});

module.exports = router;
