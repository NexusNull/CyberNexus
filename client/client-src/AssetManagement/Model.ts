import * as THREE from 'three';
import {AssetManager} from "./AssetManager";

class Model {
    name: string;
    assetManager: AssetManager;
    vertices: number[];
    normals: number[];
    textures: string[];
    faceVertexUvs: number[];
    skeleton: any;
    skinIndex: number[];
    skinWeight: number[];
    transparent: boolean;
    translucent: boolean;
    sides: [[], [], [], [], [], []];
    faceSide: Uint8Array;


    constructor(data, assetManager) {
        this.name = data.name;
        this.assetManager = assetManager;
        this.vertices = data.vertices || [];
        this.normals = data.normals || [];
        this.textures = data.textures || [];
        this.faceVertexUvs = data.faceVertexUvs || [];

        this.skeleton = data.skeleton;
        if (data.skinned) {
            this.skinIndex = data.skinIndex || [];
            this.skinWeight = data.skinWeight || [];
            this.skeleton = data.skeleton || [];
        }

        this.transparent = false;
        this.translucent = false;
        this.sides = data.sides || [[], [], [], [], [], []];

        let face = [0b001000, 0b000100, 0b000010, 0b000001, 0b100000, 0b010000];
        this.faceSide = new Uint8Array(this.textures.length);
        for (let i = 0; i < this.faceSide.length; i++) {
            this.faceSide[i] = 63;
        }
        for (let i = 0; i < this.sides.length; i++) {
            for (let index of this.sides[i]) {
                this.faceSide[index] = face[i];
            }
        }
    };


    getVertexColor(skyLight, blockLight, pos) {
        return Math.max(Math.min(Math.max(
            skyLight[pos],
            blockLight[pos]
        ), 15), 0) / 15;
    };


    applyMesh(vertices, normals, faceVertexUvs, vertexColors, modelData, x, y, z, chunk?, face?, orientation?, rotation?) {
        for (let f = 0; f < this.vertices.length / 9; f++) {

            vertices.push(
                this.vertices[f * 9] + x, this.vertices[f * 9 + 1] + y, this.vertices[f * 9 + 2] + z,
                this.vertices[f * 9 + 3] + x, this.vertices[f * 9 + 4] + y, this.vertices[f * 9 + 5] + z,
                this.vertices[f * 9 + 6] + x, this.vertices[f * 9 + 7] + y, this.vertices[f * 9 + 8] + z);

            normals.push(
                this.normals[f * 9], this.normals[f * 9 + 1], this.normals[f * 9 + 2],
                this.normals[f * 9 + 3], this.normals[f * 9 + 4], this.normals[f * 9 + 5],
                this.normals[f * 9 + 6], this.normals[f * 9 + 7], this.normals[f * 9 + 8]);

            let uv = this.assetManager.textureAtlases.get("player").textureUVMap.get(this.textures[f]);
            let point = {x: uv[4], y: uv[5]};
            let height = uv[1] - point.y;
            let width = uv[2] - point.x;
            faceVertexUvs.push(
                point.x + this.faceVertexUvs[f * 6] * width, point.y + this.faceVertexUvs[f * 6 + 1] * height,
                point.x + this.faceVertexUvs[f * 6 + 2] * width, point.y + this.faceVertexUvs[f * 6 + 3] * height,
                point.x + this.faceVertexUvs[f * 6 + 4] * width, point.y + this.faceVertexUvs[f * 6 + 5] * height);
            let color = 1;
            if (this.faceSide[f] === 0b111111) {
                let color = 1;
            }
            vertexColors.push(
                color, color, color,
                color, color, color,
                color, color, color,
            );
        }

    };

    getMesh(textureAtlas) {
        let geometry = new THREE.BufferGeometry();
        let vertices = [];
        let normals = [];
        let faceVertexUVs = [];
        let vertexColors = [];

        this.applyMesh(vertices, normals, faceVertexUVs, vertexColors, null, 0, 0, 0)
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(faceVertexUVs, 2));

        geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(this.skinIndex, 4));
        geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(this.skinWeight, 4));

        textureAtlas.material.skinning = true;
        textureAtlas.material.needsUpdate = true;

        let bones = [];
        this.parseSkeleton(this.skeleton, bones);
        var mesh = new THREE.SkinnedMesh(geometry, textureAtlas.material);

        var skeleton = new THREE.Skeleton(bones);
        mesh.add(skeleton.bones[0]);
        mesh.bind(skeleton);


        setInterval(function () {
            let time = new Date().getTime() * 0.01;
            skeleton.bones[2].rotation.x = Math.sin(time) * .3;
            skeleton.bones[3].rotation.x = Math.sin(time + Math.PI) * .3;
            skeleton.bones[5].rotation.x = Math.sin(time) * .7;
            skeleton.bones[6].rotation.x = Math.sin(time + Math.PI) * .7;

        }, 16);

        mesh.position.y = 40;
        return mesh;

    };

    parseSkeleton(boneData, bones) {
        let bone = new THREE.Bone();
        bones.push(bone);

        if (boneData.position) {
            bone.position.x = boneData.position.x;
            bone.position.y = boneData.position.y;
            bone.position.z = boneData.position.z;
        }

        if (boneData.name)
            bone.name = boneData.name;
        if (boneData.children) {
            for (let child of boneData.children) {
                let childBone = this.parseSkeleton(child, bones);
                bone.add(childBone);
            }
        }

        return bone;
    };
}

export {
    Model
};