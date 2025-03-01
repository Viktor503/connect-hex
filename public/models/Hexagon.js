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
        side = null
    ) {
        this.value = value;
        this.size = size;
        // set this.material to a deep copy of the material
        this.material = material.clone();
        this.position = position;
        this.side = side;
    }

    createHexagon() {
        let geometry = new THREE.CylinderGeometry(
            (this.size / 2) * (2 / Math.sqrt(3)),
            (this.size / 2) * (2 / Math.sqrt(3)),
            1,
            6,
            3,
        );

        let bluematerial = new THREE.MeshBasicMaterial({ color: 0x0000aa });
        let redmaterial = new THREE.MeshBasicMaterial({ color: 0xaa0000 });


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

        let extra_size_on_border = this.size/8



        //define geometries for borders
        let half_border_geometry = new THREE.BoxGeometry(this.size/4, this.size*1.2, this.size/(2*(Math.sqrt(3)))+extra_size_on_border);
        let full_border_geometry = new THREE.BoxGeometry(this.size/4, this.size*1.2, this.size/(Math.sqrt(3))+extra_size_on_border);

        //define meshes for borders and add them to the hexagon mesh
        

        
        let hexagon_border_NW_mesh = new THREE.Mesh(full_border_geometry, bluematerial);
        hexagon_border_NW_mesh.rotateY(Math.PI/3);
        hexagon_border_NW_mesh.position.x = mesh.position.x+Math.sin(Math.PI/6)*(5/8)*this.size//this.size/4;
        hexagon_border_NW_mesh.position.y = 0;
        hexagon_border_NW_mesh.position.z = mesh.position.z-Math.cos(Math.PI/6)*(5/8)*this.size//(Math.sqrt(3)/4)*this.size;
        
        let hexagon_border_NE_mesh = new THREE.Mesh(full_border_geometry, redmaterial);
        hexagon_border_NE_mesh.rotateY(-Math.PI/3);
        hexagon_border_NE_mesh.position.x = mesh.position.x+Math.sin(Math.PI/6)*(5/8)*this.size//this.size/4;
        hexagon_border_NE_mesh.position.y = 0;
        hexagon_border_NE_mesh.position.z = mesh.position.z+Math.cos(Math.PI/6)*(5/8)*this.size//(Math.sqrt(3)/4)*this.size;
        
        let hexagon_border_N_blue_mesh = new THREE.Mesh(full_border_geometry, bluematerial);
        hexagon_border_N_blue_mesh.position.x = mesh.position.x+this.size / 2+this.size/8;
        hexagon_border_N_blue_mesh.position.y = 0;
        hexagon_border_N_blue_mesh.position.z = mesh.position.z;
        
        let hexagon_border_N_red_mesh = new THREE.Mesh(full_border_geometry, redmaterial);
        hexagon_border_N_red_mesh.position.x = mesh.position.x+this.size / 2+this.size/8;
        hexagon_border_N_red_mesh.position.y = 0;
        hexagon_border_N_red_mesh.position.z = mesh.position.z
        
        let hexagon_border_SW_mesh = new THREE.Mesh(full_border_geometry, redmaterial);
        hexagon_border_SW_mesh.rotateY(-Math.PI/3);
        hexagon_border_SW_mesh.position.x = mesh.position.x-Math.sin(Math.PI/6)*(5/8)*this.size//this.size/4;
        hexagon_border_SW_mesh.position.y = 0;
        hexagon_border_SW_mesh.position.z = mesh.position.z-Math.cos(Math.PI/6)*(5/8)*this.size//(Math.sqrt(3)/4)*this.size;
        
        let hexagon_border_SE_mesh = new THREE.Mesh(full_border_geometry, bluematerial);
        hexagon_border_SE_mesh.rotateY(Math.PI/3);
        hexagon_border_SE_mesh.position.x = mesh.position.x-Math.sin(Math.PI/6)*(5/8)*this.size//this.size/4;
        hexagon_border_SE_mesh.position.y = 0;
        hexagon_border_SE_mesh.position.z = mesh.position.z+Math.cos(Math.PI/6)*(5/8)*this.size//(Math.sqrt(3)/4)*this.size;
        
        let hexagon_border_S_red_mesh = new THREE.Mesh(full_border_geometry, redmaterial);
        hexagon_border_S_red_mesh.position.x = mesh.position.x-this.size / 2-this.size/8;
        hexagon_border_S_red_mesh.position.y = 0;
        hexagon_border_S_red_mesh.position.z = mesh.position.z;
        
        let hexagon_border_S_blue_mesh = new THREE.Mesh(full_border_geometry, bluematerial);
        hexagon_border_S_blue_mesh.position.x = mesh.position.x-this.size / 2-this.size/8;
        hexagon_border_S_blue_mesh.position.y = 0;
        hexagon_border_S_blue_mesh.position.z = mesh.position.z;
        
        let hexagon_border_N_right_mesh = new THREE.Mesh(half_border_geometry, redmaterial);
        hexagon_border_N_right_mesh.position.x = mesh.position.x+this.size / 2+this.size/8;
        hexagon_border_N_right_mesh.position.y = 0;
        hexagon_border_N_right_mesh.position.z = mesh.position.z+this.size/(4*(Math.sqrt(3)))+extra_size_on_border/2;
        
        let hexagon_border_N_left_mesh = new THREE.Mesh(half_border_geometry, bluematerial);
        hexagon_border_N_left_mesh.position.x = mesh.position.x+this.size / 2+this.size/8;
        hexagon_border_N_left_mesh.position.y = 0;
        hexagon_border_N_left_mesh.position.z = mesh.position.z-this.size/(4*(Math.sqrt(3)))-extra_size_on_border/2;
        
        let hexagon_border_S_left_mesh = new THREE.Mesh(half_border_geometry, redmaterial);
        hexagon_border_S_left_mesh.position.x = mesh.position.x-this.size / 2-this.size/8;
        hexagon_border_S_left_mesh.position.y = 0;
        hexagon_border_S_left_mesh.position.z = mesh.position.z-this.size/(4*(Math.sqrt(3)))-extra_size_on_border/2;

        let hexagon_border_S_right_mesh = new THREE.Mesh(half_border_geometry, bluematerial);
        hexagon_border_S_right_mesh.position.x = mesh.position.x-this.size / 2-this.size/8;
        hexagon_border_S_right_mesh.position.y = 0;
        hexagon_border_S_right_mesh.position.z = mesh.position.z+this.size/(4*(Math.sqrt(3)))+extra_size_on_border/2;
        
        
        
        switch (this.side) {
            case "N":                
            mesh.add(hexagon_border_N_right_mesh);
            mesh.add(hexagon_border_N_left_mesh);    
                mesh.add(hexagon_border_NW_mesh);
                mesh.add(hexagon_border_NE_mesh);
                break;
            case "NE":
                mesh.add(hexagon_border_N_red_mesh);
                mesh.add(hexagon_border_NE_mesh)
                break;
            case "E":
                mesh.add(hexagon_border_N_red_mesh);
                mesh.add(hexagon_border_NE_mesh);
                mesh.add(hexagon_border_SE_mesh);
                mesh.add(hexagon_border_S_blue_mesh);
                break;
            case "SE":
                mesh.add(hexagon_border_SE_mesh);
                mesh.add(hexagon_border_S_blue_mesh);
                break;
            case "S":
                mesh.add(hexagon_border_SW_mesh);
                mesh.add(hexagon_border_SE_mesh);
                mesh.add(hexagon_border_S_left_mesh);
                mesh.add(hexagon_border_S_right_mesh);
                break;
            case "SW":
                mesh.add(hexagon_border_SW_mesh);
                mesh.add(hexagon_border_S_red_mesh);
                break;
            case "W":
                mesh.add(hexagon_border_N_blue_mesh)
                mesh.add(hexagon_border_NW_mesh);
                mesh.add(hexagon_border_SW_mesh);
                mesh.add(hexagon_border_S_red_mesh);
                break;
            case "NW":
                mesh.add(hexagon_border_NW_mesh);
                mesh.add(hexagon_border_N_blue_mesh);
                break;        
            default:
                break;
        }
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
