import * as THREE from "three";
import {MeshLambertMaterial} from "three";

class TextureAtlas {
    name: string;
    opts: {
        transparent: boolean,
        alphaTest: number,
        vertexColors: boolean,
    };
    size: number;
    textures: Map<string, any>;
    materialType: string;
    material: THREE.Material;
    textureUVMap: Map<string, any>;

    constructor(texture, data) {
        this.name = data.name;
        this.opts = data.opts || {};
        this.size = data.size;
        this.textures = new Map();

        this.materialType = data.materialType;
        this.material = new THREE[data.materialType]({map: texture});

        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;

        if (this.opts.transparent !== undefined)
            this.material.transparent = this.opts.transparent;

        if (this.opts.alphaTest !== undefined)
            this.material.alphaTest = this.opts.alphaTest;

        if (this.opts.vertexColors !== undefined)
            this.material.vertexColors = this.opts.vertexColors;

        this.textureUVMap = new Map();
        for (let name in data.textures) {
            this.textures.set(name, data.textures[name]);
        }
        for (let name in data.textureUVMap) {
            this.textureUVMap.set(name, data.textureUVMap[name]);
        }
    };
}

export {TextureAtlas};