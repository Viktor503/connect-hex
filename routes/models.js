const express = require("express");
const router = express.Router();
const { randomModel } = require("../public/ai_models/random_model");
const { greedyModel } = require("../public/ai_models/greedy_model");
const {
    greedyModelErdosSelfridge,
} = require("../public/ai_models/greedy_erdos-selfridge");
const {
    greedyModelStochastic,
} = require("../public/ai_models/stohastic_greedy_model");
const { oddEmptyRight } = require("../public/ai_models/odd_empty_right");
const { oddEmptyLeft } = require("../public/ai_models/odd_empty_left");

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

router.post("/stohastic_greedy", async (req, res) => {
    let model = new greedyModelStochastic(
        req.body.playerOrder,
        req.body.hexMode,
    );

    result = model.predict(req.body.gameState);
    res.json(result);
});

router.post("/greedy_erdos-selfridge", async (req, res) => {
    let model = new greedyModelErdosSelfridge(
        req.body.playerOrder,
        req.body.hexMode,
    );
    result = model.predict(req.body.gameState);
    res.json(result);
});

router.post("/odd_empty_right", async (req, res) => {
    let model = new oddEmptyRight(req.body.playerOrder, req.body.hexMode);
    result = model.predict(req.body.gameState);
    res.json(result);
});

router.post("/odd_empty_left", async (req, res) => {
    let model = new oddEmptyLeft(req.body.playerOrder, req.body.hexMode);
    result = model.predict(req.body.gameState);
    res.json(result);
});

module.exports = router;
