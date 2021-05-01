import {TextureAtlas} from './TextureAtlas';
import {Texture} from 'three';
import { Geometry } from '../definitions/Geometry';

export class Assets {
    textureAtlases: Map<string, TextureAtlas>;
    textures: Map<string, Texture>;
    geometries: Map<number, Geometry>;

    constructor() {
        this.textureAtlases = new Map<string, TextureAtlas>();
        this.textures = new Map<string, Texture>();
        this.geometries = new Map<number, Geometry>();
    }
}
