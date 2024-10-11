import * as THREE from "three";
class Hexagon_field {
    constructor(
        value = 0,
        size = 1,
        material,
        position = { x: 0, y: 0, z: 0 },
    ) {
        this.value = value;
        this.size = size;
        this.material = material;
        this.position = position;
    }

    createHexagon() {
        let geometry = new THREE.CylinderGeometry(
            this.size,
            this.size,
            1,
            6,
            3,
        );
        let mesh = new THREE.Mesh(geometry, this.material);
        mesh.rotation.x = Math.PI / 2;
        mesh.rotation.y = Math.PI / 2;
        mesh.position.x = this.position.x;
        mesh.position.y = this.position.y;
        mesh.position.z = this.position.z;
        this.mesh = mesh;
        return this.mesh;
    }
}

export { Hexagon_field };
