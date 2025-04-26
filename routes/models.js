const express = require("express");
const router = express.Router();
const { randomModel } = require("../public/ai_models/random_model");
const { greedyModel } = require("../public/ai_models/greedy_model");

router.post("/random", async (req, res) => {
    let model = new randomModel(req.body.playerOrder, req.body.hexMode);

    result = model.predict(req.body.gameState);
    res.json(result);
});

router.post("/greedy", async (req, res) => {
    let model = new greedyModel(req.body.playerOrder, req.body.hexMode);

    result = model.predict(req.body.gameState);
    res.json(result);
});


module.exports = router;
