/**
 * This is the beam class it supposed to be a help to create beams, this should in the future be exported to hardware
 * instanced objects the math is simple and can effectively be done on a gpu.
 *
 */
import * as THREE from "three";

export class Beam {
    start: THREE.Vector3;
    end: THREE.Vector3;
    speed: number;
    thickness: number;
    mesh: THREE.Mesh;
    material: THREE.MeshBasicMaterial;
    texture: THREE.Texture;
    geometry: THREE.BufferGeometry;

    constructor(start: THREE.Vector3, end: THREE.Vector3, speed: number, thickness: number, texture: THREE.Texture) {
        this.start = start;
        this.end = end;
        this.speed = speed;
        this.thickness = thickness;
        this.texture = texture.clone();
        this.texture.needsUpdate = true;
        this.texture.wrapS = THREE.RepeatWrapping;

        this.material = new THREE.MeshBasicMaterial({map: this.texture, color: 0xffffff, transparent: true});
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(new Array(12).fill(0), 3));
        this.geometry.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 0, 1, 1, 0, 1, 1], 2));
        this.geometry.setIndex([2, 1, 0, 1, 2, 3]);
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.onBeforeRender = (renderer, scene, camera, geometry: THREE.BufferGeometry, material, group) => {
            this.texture.offset.x += this.speed;
            this.texture.repeat.set(this.start.clone().sub(this.end).length() / this.thickness, 1);

            let camPos = camera.position.clone().applyMatrix4(new THREE.Matrix4().getInverse(this.mesh.matrixWorld));
            let vecA = camPos.clone().sub(this.start);
            let vecB = camPos.clone().sub(this.end);
            let cross = new THREE.Vector3().crossVectors(vecA, vecB);
            cross.normalize().multiplyScalar(this.thickness / 2);

            this.start.clone().add(cross).toArray(geometry.attributes.position.array, 0);
            this.start.clone().sub(cross).toArray(geometry.attributes.position.array, 3);
            this.end.clone().add(cross).toArray(geometry.attributes.position.array, 6);
            this.end.clone().sub(cross).toArray(geometry.attributes.position.array, 9);
            geometry.computeBoundingSphere();
            (<THREE.BufferAttribute>geometry.attributes.position).needsUpdate = true;
        }
    }

    dispose() {
        this.mesh.parent.remove(this.mesh);
        this.geometry.dispose();
        this.texture.dispose();
        this.material.dispose();
    }

}