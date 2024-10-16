const express = require("express");
const indexrouter = require("./routes/index");
const gamerouter = require("./routes/game");
const bodyParser = require("body-parser");

const app = express();

const PORT = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use("/", indexrouter);
app.use("/game", gamerouter);
app.use("/css", express.static("./public/css"));
app.use("/threejs", express.static("./public/threejs"));
app.use("/textures", express.static("./public/textures"));
app.use("/models", express.static("./public/models"));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
