import * as THREE from "three";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
class Hexagon_field {
    constructor(
        value = 0,
        size = 1,
        material,
        position = { x: 0, y: 0, z: 0 },
    ) {
        this.value = value;
        this.size = size;
        // set this.material to a deep copy of the material
        this.material = material.clone();
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
        let points_geonometry = new LineGeometry();
        points_geonometry.setPositions(edges.attributes.position.array);

        const line = new LineSegments2(
            points_geonometry,
            new LineMaterial({
                color: 0xffffff,
                linewidth: 3,
                resolution: new THREE.Vector2(640, 480),
            }),
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
