const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    if (req.cookies) {
        const error = req.cookies.error || null;
        res.clearCookie("error");
        res.render("index", { error: error });
    } else {
        const error = null;
        res.render("index", { error: error });
    }
});

module.exports = router;
