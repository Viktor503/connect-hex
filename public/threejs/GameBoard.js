import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js";

const scene = new THREE.Scene();

console.log(boardSize);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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

window.addEventListener("resize", onWindowResize, false);
window.addEventListener("keydown", (e) => {
    if (e.key === "r" || e.key === "R") {
        controls.reset();
    }
});

animate();
