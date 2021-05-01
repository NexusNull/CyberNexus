const PNG = require('pngjs').PNG;

class Texture {
    /**
     *
     * @param name {string}
     * @param png {PNG}
     */
    constructor(name, png) {
        this.name = name;
        this.png = png;
        this.width = this.png.width;
        this.height = this.png.height;
    }
}

module.exports = Texture;