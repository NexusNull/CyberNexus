/**
 * This is the beam class it supposed to be a help to create beams, this should in the future be exported to hardware
 * instanced objects the math is simple and can effectively be done on a gpu.
 *
 */
import * as THREE from 'three';

export class Beam {
    start: THREE.Vector3;
    end: THREE.Vector3;
    speed: number;
    thickness: number;
    mesh: THREE.Mesh;
    material: THREE.MeshBasicMaterial;
    geometry: THREE.BufferGeometry;

    constructor(start: THREE.Vector3, end: THREE.Vector3, speed: number, thickness: number, ) {
        this.start = start;
        this.end = end;
        this.speed = speed;
        this.thickness = thickness;


        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true});
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Array(12).fill(0), 3));
        this.geometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 0, 1, 1, 0, 1, 1], 2));
        this.geometry.setIndex([2, 1, 0, 1, 2, 3]);
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.onBeforeRender = (renderer, scene, camera, geometry: THREE.BufferGeometry) => {
            const camPos = camera.position.clone().applyMatrix4(new THREE.Matrix4().copy(this.mesh.matrixWorld).invert());
            const vecA = camPos.clone().sub(this.start);
            const vecB = camPos.clone().sub(this.end);
            const cross = new THREE.Vector3().crossVectors(vecA, vecB);
            cross.normalize().multiplyScalar(this.thickness / 2);

            this.start.clone().add(cross).toArray(geometry.attributes.position.array, 0);
            this.start.clone().sub(cross).toArray(geometry.attributes.position.array, 3);
            this.end.clone().add(cross).toArray(geometry.attributes.position.array, 6);
            this.end.clone().sub(cross).toArray(geometry.attributes.position.array, 9);
            geometry.computeBoundingSphere();
            (<THREE.BufferAttribute>geometry.attributes.position).needsUpdate = true;
        };
    }

    dispose(): void {
        this.mesh.parent.remove(this.mesh);
        this.geometry.dispose();
        this.material.dispose();
    }
}
