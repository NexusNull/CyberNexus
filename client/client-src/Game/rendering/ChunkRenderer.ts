import {Assets} from '../../AssetManagement/Assets';
import {BufferGeometry, Float32BufferAttribute} from 'three';

export class ChunkRenderer {
    assets: Assets;

    constructor(assets: Assets) {
        this.assets = assets;

    }

    renderChunk(data) {
        const geo = {
            vertices: [],
            normals: [],
            uvCoords: [],
        };
        for (let y = 0; y < 32; y++) {
            for (let z = 0; z < 16; z++) {
                for (let x = 0; x < 16; x++) {
                    const i = (y + 1) * 612 + (z + 1) * 18 + x + 1;
                    const id = data[i];
                    if (id > 0) {
                        const sides = {
                            south: !data[i + 18],
                            east: !data[i + 1],
                            north: !data[i - 18],
                            west: !data[i - 1],
                            up: !data[i + 612],
                            down: !data[i - 612],
                        };
                        for (const side in sides) {
                            if (sides[side]) {
                                const geometry = this.assets.geometries.get(id);
                                const vert = geometry.vertices.slice(geometry.sides[side][0] * 9, (geometry.sides[side][1] + 1) * 9);
                                const norm = geometry.normals.slice(geometry.sides[side][0] * 9, (geometry.sides[side][1] + 1) * 9);
                                const uv = geometry.uvs.slice(geometry.sides[side][0] * 6, (geometry.sides[side][1] + 1) * 6);

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
        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(geo.vertices, 3));
        geometry.setAttribute('normal', new Float32BufferAttribute(geo.normals, 3));
        geometry.setAttribute('uv', new Float32BufferAttribute(geo.uvCoords, 2));

        return geometry;
    }
}
