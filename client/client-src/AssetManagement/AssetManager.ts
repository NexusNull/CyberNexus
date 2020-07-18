/**
 *
 * Load all assets from the server and add them to AssetManager
 * @constructor
 */
import * as THREE from 'three';
import {Model} from "./Model";
import {util} from "../util/Util"
import {TextureAtlas} from "./TextureAtlas";
import {EventSystem} from "../util/EventSystem";


class AssetManager extends EventSystem {
    loadManager: THREE.LoadingManager;
    textureLoader: THREE.TextureLoader;
    textureAtlasesTextures: Map<any, any>;
    textureAtlases: Map<any, TextureAtlas>;
    textures: Map<any, any>;
    models: Map<any, any>;
    onError: (message, percentage) => void;
    onProgress: (string, number) => void;
    onFinish: (string) => void;

    constructor() {
        super();
        this.loadManager = new THREE.LoadingManager();
        this.textureLoader = new THREE.TextureLoader(this.loadManager);
        this.textureAtlasesTextures = new Map();
        this.textureAtlases = new Map();
        this.textures = new Map();
        this.models = new Map();
    };


    async init() {
        let self = this;
        this.emit("progress", {message: "Loading asset database", percentage: 0});

        let assetDB: { textures: any[], textureAtlases: any[] };
        try {
            assetDB = await util.loadJSON("/data/assetDB.json");
        } catch (e) {
            this.emit("error", {message: e});
            return;
        }
        this.emit("progress", {message: "Loading Textures", percentage: .02});

        for (let atlasData of assetDB.textureAtlases) {
            this.textureLoader.load(atlasData.imagePath, function (texture) {
                self.textureAtlasesTextures.set(atlasData.name, texture);
            });
        }

        for (let textureData of assetDB.textures) {
            this.textureLoader.load(textureData.path, function (texture) {
                if (textureData.opts) {
                    for (let key in textureData.opts) {
                        texture[key] = textureData.opts[key];
                    }
                    texture.needsUpdate = true;
                }
                self.textures.set(textureData.name, texture);
            });
        }

        this.loadManager.onProgress = function (url, itemsLoaded, itemsTotal) {
            self.emit("progress", {
                message: "Loaded: " + url,
                percentage: (0.1 - 0.02) * (itemsLoaded / itemsTotal) + 0.02
            });
        };

        await new Promise(function (resolve) {
            self.loadManager.onLoad = resolve;
        });

        this.emit("progress", {message: "Creating Texture Atlases", percentage: 0.1});
        for (let atlasData of assetDB.textureAtlases) {
            let texture = this.textureAtlasesTextures.get(atlasData.name);
            let data = await util.loadJSON(atlasData.jsonPath);
            this.textureAtlases.set(atlasData.name, new TextureAtlas(texture, data));
        }

        this.emit("progress", {message: "Creating Models", percentage: 0.2});
        let modelsData = await util.loadJSON("/data/models.json");
        for (let modelData of modelsData) {
            let model = new Model(modelData, this);
            this.models.set(modelData.name, model);
        }

        this.emit("finished", {message: "Finished!"})
    };

}

export {AssetManager}