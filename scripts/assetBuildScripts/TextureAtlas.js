const PNG = require('pngjs').PNG;
const pngJsUtil = require("pngjs-util");
const fs = require("fs");
const path = require("path");

class TextureAtlas {
    constructor(name, opts, size, materialType) {
        if ((size & (size - 1)) !== 0) {
            throw new Error("size needs to be a power of 2");
        }

        this.name = name;
        this.opts = opts || {};
        this.size = size;
        this.materialType = materialType;

        this.textureUVMap = new Map();
        this.textures = new Map();

        this.atlasImage = new PNG({
            width: this.size,
            height: this.size,
        });

        this.pos = {x: 0, y: this.size};
        this.line = this.size;

        this.data = null;
    }

    addTexture(name, texture) {
        let width = texture.width;
        let height = texture.height;

        if (width > this.size || height > this.size) {
            throw new Error("Texture exceeds atlas");
        }

        if (this.pos.x + width > this.size) {
            this.pos.x = 0;
            this.pos.y = this.line;
        }

        pngJsUtil.insert(texture.png, this.atlasImage, (this.pos.x), (this.pos.y - height));

        texture.position = {
            x: (this.pos.x),
            y: (this.pos.y - height)
        };

        this.textureUVMap.set(name, [
            (this.pos.x) / this.size, (this.size - this.pos.y + height) / this.size,
            (this.pos.x + width) / this.size, (this.size - this.pos.y + height) / this.size,
            (this.pos.x) / this.size, (this.size - this.pos.y) / this.size,
            (this.pos.x + width) / this.size, (this.size - this.pos.y) / this.size,
        ]);

        this.line = Math.min(this.line, this.pos.y - height);
        this.pos.x = this.pos.x + width;
        this.textures.set(name, texture);
    }

    finalize() {
        let data = {
            name: this.name,
            opts: this.opts,
            size: this.size,
            materialType: this.materialType,
            textureUVMap: {},
            textures: [],
        };
        for (let texture of this.textureUVMap) {
            data.textureUVMap[texture[0]] = texture[1];
        }
        for (let texture of this.textures) {
            data.textures.push(
                {
                    name: texture[0],
                    size: {width: texture[1].width, height: texture[1].height},
                    position: {x: texture[1].position.x, y: texture[1].position.y}
                }
            );
        }
        let pngBuffer = PNG.sync.write(this.atlasImage);
        data.image = "data:image/png;base64," + pngBuffer.toString("base64");
        this.data = data;
    }

    async writeFile(fileName) {
        if (this.data !== null)
            await fs.promises.writeFile(fileName, JSON.stringify(this.data, null, 4));
        else
            throw new Error("Data texture atlas isn't finalized yet and can't be exported")
    }
}

module.exports = TextureAtlas;