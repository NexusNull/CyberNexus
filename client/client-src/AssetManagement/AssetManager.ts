/**
 *
 * Load all assets from the server and add them to AssetManager
 * @constructor
 */
import * as THREE from 'three';
import {EventSystem} from '../util/EventSystem';
import {Assets} from './Assets';


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
        await this.emit('progress', {message: 'Loading ...', percentage: 0});
        await this.emit('finished', {message: 'Finished!'});
    }
}
