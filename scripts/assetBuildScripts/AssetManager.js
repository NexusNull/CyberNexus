const Texture = require("./Texture");
const pngJs_util = require("pngjs-util");
const TextureAtlas = require("./TextureAtlas");
const path = require("path");
const fs = require("fs");


function randStr(length) {
    let alph = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
    let out = "";
    for (let i = 0; i < length; i++) {
        out += alph[Math.floor(alph.length * Math.random())];
    }
    return out;
}


class AssetManager {
    constructor(assetPath, outputPath) {
        this.assetPath = assetPath;
        this.outputPath = outputPath;
        this.textures = new Map();
        this.textureAtlases = new Map();
        this.toExport = [];
        this.assetDB = {
            texture: [],
            textureAtlases: [],
        };
        this.data = null;
    }

    async loadTextures() {
        let texturesData = require(path.join(this.assetPath, "/textures/Textures"));

        for (let textureData of texturesData) {
            let png;

            if (this.textures.has(textureData.name)) {
                console.error(`duplicate texture detected '${textureData.name}', skipping ...`);
                continue;
            }

            try {
                png = await pngJs_util.loadFile(path.join(this.assetPath, "textures/", textureData.path));
            } catch (e) {
                console.error(`failed to load '${path.join(this.assetPath, "textures/", textureData.path)}'`);
                continue;
            }

            this.textures.set(textureData.name, new Texture(textureData.name, png));

            if (textureData.export) {
                this.toExport.push(textureData);
            }
        }
    }

    async createTextureAtlases() {
        let files = await fs.promises.readdir(path.join(this.assetPath, "textureAtlases/"));
        for (let file of files) {
            if (path.extname(file) === ".json") {
                let buffer;
                try {
                    buffer = await fs.promises.readFile(path.join(this.assetPath, "textureAtlases/", file));
                } catch (e) {
                    console.error(`Unable to open File: '${path.join(this.assetPath, "textureAtlases/", file)}' \n${e}`);
                    continue;
                }

                let data;
                try {
                    data = JSON.parse(buffer.toString());
                } catch (e) {
                    console.error(`Unable to parse File: '${path.join(this.assetPath, "textureAtlases/", file)}' \n${e}`);
                    continue;
                }

                let textureAtlas = new TextureAtlas(data.name, data.opts, data.size, data.materialType);

                for (let textureData of data.textures) {
                    let texture = this.textures.get(textureData.name);
                    //TODO image transformations
                    if (texture) {
                        textureAtlas.addTexture(textureData.name, texture);
                    }
                }

                textureAtlas.finalize();
                this.textureAtlases.set(file, textureAtlas);
            }
        }

    }


    async export() {
        let fileNames = new Set();
        if (this.toExport.length > 0)
            await fs.promises.mkdir(path.join(this.outputPath, "/textures"));

        if (this.textureAtlases.size > 0)
            await fs.promises.mkdir(path.join(this.outputPath, "/textureAtlases"));

        for (let texture of this.toExport) {
            //unique file name
            let fileName = "";
            do {
                fileName = randStr(12);
            } while (fileNames.has(fileName));

            let destPath = path.join(this.outputPath, "/textures/", fileName + path.extname(texture.path));

            await fs.promises.copyFile(
                path.join(this.assetPath, "/textures/", texture.path),
                destPath,
            );
            this.assetDB.texture.push({
                name: texture.name,
                opts: texture.opts,
                path: "/textures/" + fileName + path.extname(texture.path),
            });
        }

        for (let textureAtlas of this.textureAtlases) {

            await textureAtlas[1].writeFile(path.join(this.outputPath, "textureAtlases", textureAtlas[0]));
            this.assetDB.textureAtlases.push({
                name: textureAtlas[1].name,
                path: "/textureAtlases/" + textureAtlas[0],
            })
        }

        await fs.promises.writeFile(path.join(this.outputPath, "assetDB.json"), JSON.stringify(this.assetDB, null, 4));

    }

}

module.exports = AssetManager;