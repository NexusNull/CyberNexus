import {Texture} from 'three';
import { Geometry } from '../definitions/Geometry';

export class Assets {
    textures: Map<string, Texture>;
    geometries: Map<number, Geometry>;

    constructor() {
        this.textures = new Map<string, Texture>();
        this.geometries = new Map<number, Geometry>();
    }
}
