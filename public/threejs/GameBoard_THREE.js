import * as THREE from "three";
import { OrbitControls } from "three/addons/OrbitControls.js";
import { Game } from "../models/Game.js";
import { GameBoard } from "../models/GameBoard.js";
let scene, renderer, camera, thing, controls;

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

    //set up game board
    let texture = new THREE.TextureLoader().load("../textures/wood.jpg");
    let material = new THREE.MeshBasicMaterial({ map: texture });

    let gameBoard = new GameBoard(boardSize, 1, material);
    let game = new Game(gameBoard);
    gameBoard.addToScene(scene);

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
                game.paintDiagonal(selectedField.name, false);
            }
            if (intersects[0].object.type == "Mesh") {
                selectedField = intersects[0].object;
                game.paintDiagonal(selectedField.name, true);
            }
        } else {
            if (selectedField) {
                game.paintDiagonal(selectedField.name, false);
                selectedField = null;
            }
        }
    });

    //set up click event
    renderer.domElement.addEventListener("click", (event) => {
        if (!selectedField) return;
        game.markField(selectedField.name);
    });

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
