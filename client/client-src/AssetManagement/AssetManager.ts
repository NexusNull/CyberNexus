/**
 *
 * Load all assets from the server and add them to AssetManager
 * @constructor
 */
import * as THREE from 'three';
import util from '../util/Util';
import {TextureAtlas} from './TextureAtlas';
import {EventSystem} from '../util/EventSystem';
import {Assets} from './Assets';
import {Texture} from "three";


export class AssetManager extends EventSystem {
    loadManager: THREE.LoadingManager;
    textureLoader: THREE.TextureLoader;
    assets: Assets;

    constructor(assets: Assets) {
        super();
        this.assets = assets;
        this.loadManager = new THREE.LoadingManager();
        this.textureLoader = new THREE.TextureLoader(this.loadManager);

    }


    async init(): Promise<void> {

        this.emit('progress', {message: 'Loading asset database', percentage: 0});

        let assetDB: { textures: { name: string, path: string, opts: any }[], textureAtlases: { name: string, path: string }[] };

        try {
            assetDB = await util.loadJSON('/data/assetDB.json');
        } catch (e) {
            this.emit('error', {message: e});
            return;
        }

        this.emit('progress', {message: 'Loading Textures', percentage: .02});

        for (const atlasData of assetDB.textureAtlases) {
            const data = await util.loadJSON(atlasData.path);
            this.textureLoader.load(data.image, (texture) => {
                this.assets.textureAtlases.set(atlasData.name, new TextureAtlas(texture, data));
            });
        }

        for (const textureData of assetDB.textures) {
            this.textureLoader.load(textureData.path, (texture) => {
                if (textureData.opts) {
                    for (const key in textureData.opts) {
                        texture[key] = textureData.opts[key];
                    }
                    texture.needsUpdate = true;
                }
                this.assets.textures.set(textureData.name, texture);
            });
        }

        this.loadManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            this.emit('progress', {
                message: 'Loaded: ' + url,
                percentage: (0.1 - 0.02) * (itemsLoaded / itemsTotal) + 0.02,
            });
        };

        await new Promise((resolve) => {
            this.loadManager.onLoad = resolve;
        });

        this.emit('progress', {message: 'Creating Geometries', percentage: 0.2});

        const geometries = await util.loadJSON('/data/geometries.json');
        for (const geometry of geometries) {
            this.assets.geometries.set(geometry.id, geometry);
        }

        this.emit('finished', {message: 'Finished!'});
    }
}
