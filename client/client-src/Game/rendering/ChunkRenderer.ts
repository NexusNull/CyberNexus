import {Assets} from "../../AssetManagement/Assets";
import THREE from "three";

class ChunkRenderer {
    assets: Assets;

    constructor(assets) {


    }

    renderChunk(data, textureAtlasName) {
        let geo = {
            vertices: [],
            normals: [],
            uvCoords: [],
        };
        for (let y = 0; y < 32; y++) {
            for (let z = 0; z < 16; z++) {
                for (let x = 0; x < 16; x++) {
                    let i = (y + 1) * 612 + (z + 1) * 18 + x + 1;
                    let id = data.blocks[i];
                    if (id > 0) {
                        let sides = {
                            south: !data[i + 18],
                            east: !data[i + 1],
                            north: !data[i - 18],
                            west: !data[i - 1],
                            up: !data[i + 612],
                            down: !data[i - 612],
                        };
                        for (let side in sides) {
                            if (sides[side]) {
                                let vert = this.assets.geometries[id].position.slice(this.assets.geometries[1].sides[side][0] * 9, this.assets.geometries[1].sides[side][1] * 9);
                                let norm = this.assets.geometries[id].position.slice(this.assets.geometries[1].sides[side][0] * 9, this.assets.geometries[1].sides[side][1] * 9);
                                let uv = this.assets.geometries[id].position.slice(this.assets.geometries[1].sides[side][0] * 6, this.assets.geometries[1].sides[side][1] * 6);

                                for (let i = 0; i < vert.length / 3; i++) {
                                    geo.vertices.push(
                                        vert[i * 3] + x,
                                        vert[i * 3 + 1] + y / 2,
                                        vert[i * 3 + 2] + z);
                                }
                                geo.normals.push(...norm);
                                geo.uvCoords.push(...uv);
                            }
                        }
                    }
                }
            }
        }
        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(geo.vertices, 3));
        geometry.setAttribute("normal", new THREE.Float32BufferAttribute(geo.normals, 3));
        geometry.setAttribute("uv", new THREE.Float32BufferAttribute(geo.uvCoords, 2));

        return new THREE.Mesh(geometry, this.assets.getTextureAtlas(textureAtlasName).material);
    }
}

export {ChunkRenderer}