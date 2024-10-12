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
            (this.size / 2) * (2 / Math.sqrt(3)),
            (this.size / 2) * (2 / Math.sqrt(3)),
            1,
            6,
            3,
        );
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 5 }),
        );
        let mesh = new THREE.Mesh(geometry, this.material);
        mesh.add(line);
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
