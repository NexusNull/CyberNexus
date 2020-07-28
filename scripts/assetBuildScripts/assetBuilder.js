const AssetManager = require("./AssetManager");

const fs = require("fs");
const path = require("path");
const assetPath = path.join(__dirname, "../../assets/");
const outputPath = path.join(__dirname, "../../client/public/data");

async function main() {
    console.log("clearing directory: " + outputPath);


    let contents = await fs.promises.readdir(outputPath);
    for (let fileName of contents) {
        let filePath = path.join(outputPath, fileName)
        if ((await fs.promises.stat(filePath)).isDirectory()) {
            fs.promises.rmdir(filePath, {recursive: true});
        } else {
            await fs.promises.unlink(filePath);
        }
    }

    let assetManager = new AssetManager(assetPath, outputPath);
    await assetManager.loadTextures();
    await assetManager.createTextureAtlases();
    await assetManager.export();

}

main();
