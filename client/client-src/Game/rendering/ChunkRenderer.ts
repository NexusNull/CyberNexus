import {Assets} from "../../AssetManagement/Assets";
import {BufferGeometry, Float32BufferAttribute} from "three";

export class ChunkRenderer {
    constructor(public assets: Assets) {


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
                    let id = data[i];
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
                                let geometry = this.assets.geometries.get(id);
                                let vert = geometry.vertices.slice(geometry.sides[side][0] * 9, (geometry.sides[side][1] + 1) * 9);
                                let norm = geometry.normals.slice(geometry.sides[side][0] * 9, (geometry.sides[side][1] + 1) * 9);
                                let uv = geometry.uvs.slice(geometry.sides[side][0] * 6, (geometry.sides[side][1] + 1) * 6);

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
        let geometry = new BufferGeometry();
        geometry.setAttribute("position", new Float32BufferAttribute(geo.vertices, 3));
        geometry.setAttribute("normal", new Float32BufferAttribute(geo.normals, 3));
        geometry.setAttribute("uv", new Float32BufferAttribute(geo.uvCoords, 2));

        return geometry;
    }
}