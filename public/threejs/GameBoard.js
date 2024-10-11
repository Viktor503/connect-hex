import { OrbitControls } from "OrbitControls";
import * as THREE from "three";
import { Hexagon_field } from "./Hexagon.js";
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

    let texture = new THREE.TextureLoader().load("../textures/wood.jpg");
    let material = new THREE.MeshBasicMaterial({ map: texture });

    let hexagon = new Hexagon_field(1, 1, material);
    let hexa = hexagon.createHexagon();
    scene.add(hexa);

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
