const express = require("express");
const indexrouter = require("./routes/index");
const gamerouter = require("./routes/game");
const modelrouter = require("./routes/models.js");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");
const http = require("http");

const app = express();
const server = http.createServer(app);

const socketManager = require("./public/socketio/socketio_manager.js");
socketManager.initialize(server);

const PORT = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use("/", indexrouter);
app.use(
    "/game",
    (req, res, next) => {
        req.socketManager = socketManager;
        next();
    },
    gamerouter,
);
app.use("/models", modelrouter);
app.use("/css", express.static("./public/css"));
app.use("/threejs", express.static("./public/threejs"));
app.use("/ai_models", express.static("./public/ai_models"));
app.use("/textures", express.static("./public/textures"));
app.use("/models", express.static("./public/models"));
app.use("/favicon.ico", express.static("./public/favicon.ico"));

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
