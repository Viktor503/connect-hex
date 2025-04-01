import * as THREE from "three";
import { OrbitControls } from "three/addons/OrbitControls.js";
import { Game } from "../models/Game.js";
import { GameBoard } from "../models/GameBoard.js";
let scene, renderer, camera, thing, controls;

function writePlayerListGui() {
    players_info = document.getElementById("players_info");
    players_info.innerHTML = "";

    // Create the bold red span
    const player1 = document.createElement("span");
    const player2 = document.createElement("span");

    if (ai_mode) {
        player1.textContent = `player1 ${player_order == 1 ? "(you)" : "(ai)"}`;
        player2.textContent = `player2 ${player_order == 2 ? "(you)" : "(ai)"}`;
    } else {
        player1.textContent = `player1`;
        player2.textContent = `player2`;
    }

    if (game.currentPlayer == 1) player1.style.fontWeight = "bold"; // Make it bold
    if (game.currentPlayer == 2) player2.style.fontWeight = "bold"; // Make it bold

    player1.style.color = "red";
    player2.style.color = "RoyalBlue";

    const br = document.createElement("br");

    // Append both spans to the paragraph
    players_info.appendChild(player1);
    players_info.appendChild(br);
    players_info.appendChild(player2);
}

function init() {
    //set up scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );
    camera.position.z = 10;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //set up controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxDistance = 80;
    controls.minDistance = 7;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.minAzimuthAngle = -Math.PI / 4;
    controls.maxAzimuthAngle = Math.PI / 4;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI * (3 / 4);

    //set up game board
    let texture = new THREE.TextureLoader().load("../textures/wood.jpg");
    let material = new THREE.MeshLambertMaterial({ map: texture });

    //add ambient light
    // let light = new THREE.AmbientLight(0x0000ff,3);
    // scene.add(light);
    let light = new THREE.AmbientLight(0x0000ff, 14);
    scene.add(light);
    let light2 = new THREE.AmbientLight(0xffffff, 7);
    scene.add(light2);

    let gameBoard = new GameBoard(boardSize, 1, material);
    let game = new Game(gameBoard);
    if (online_mode) {
        if (order == 2) {
            game.switchPlayer();
        }
    }
    window.game = game;
    gameBoard.addToScene(scene);
    if (!online_mode) {
        writePlayerListGui({});
    }
    //set up change color on hover
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    let selectedField = null;
    renderer.domElement.addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        let intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0) {
            if (selectedField) {
                game.paintMove(selectedField.name, false, hex_mode);
            }
            if (
                intersects[0].object.type == "Mesh" &&
                intersects[0].object.name != ""
            ) {
                selectedField = intersects[0].object;
                game.paintMove(selectedField.name, true, hex_mode);
            }
        } else {
            if (selectedField) {
                game.paintMove(selectedField.name, false, hex_mode);
                selectedField = null;
            }
        }
    });

    //set up click event
    renderer.domElement.addEventListener("click", (event) => {
        if (!selectedField) return;

        if (online_mode) {
            game.markField(selectedField.name, hex_mode, false, false);
            gameMove(selectedField.name);
        } else {
            game.markField(selectedField.name, hex_mode);
            writePlayerListGui();
        }
    });
}

const animate = function () {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);
window.addEventListener("keydown", (e) => {
    if (e.key === "r" || e.key === "R") {
        controls.reset();
    }
});

init();
animate();

// let texture = new THREE.TextureLoader().load("../textures/wood.jpg");

//     var arcShape = new THREE.Shape();
//     arcShape.absarc(0, 0, 1, 0, Math.PI * 2, 0, false);

//     var holePath = new THREE.Path();
//     holePath.absarc(0, 0, 0.7, 0, Math.PI * 2, true);
//     arcShape.holes.push(holePath);

//     var geometry = new THREE.ExtrudeGeometry(arcShape, {
//         curveSegments: 3,
//         bevelEnabled: false,
//     });
//     var material = new THREE.MeshBasicMaterial({
//         color: 0x990066,
//         map: texture,
//     });

//     thing = new THREE.Mesh(geometry, material);
//     scene.add(thing);
