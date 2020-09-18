const fs = require("fs");
const path = require("path");
const clientDir = path.join(process.cwd(), "/server/data/users");

/**
 * Proxies the filesystem for a specific user
 */
class FileSystem {

    constructor(userId) {
        this.changed = false;
        this.userId = userId;
        this.path = path.join(clientDir, userId + "/");
    }

    async getIndex() {
        let index
        try {
            index = (await fs.promises.readFile(path.join(this.path, "Index.json"))).toString();
        } catch (e) {
        }

        if (index) {
            return index;
        } else {
            let index = JSON.stringify(await this.createIndex());
            fs.promises.writeFile(path.join(this.path, "Index.json"), index);
            return index;
        }
    }

    async createIndex() {
        let start = process.hrtime();
        let dirPath = path.join(clientDir, this.userId + "", "rootFS");

        const fstat = fs.statSync(dirPath);
        let dir = {
            name: this.userId + "",
            children: [],
            ctime: fstat.ctime,

        };
        await this._createDirectoryIndex(dirPath, dir.children);

        let time = process.hrtime(start);
        if (time[0] > 5) {
            console.warn(`Directory index of ${dir} took ${time[0]} seconds, that is too long`);
        }

        return dir;
    }

    async _createDirectoryIndex(dpath, tree) {
        const files = await fs.promises.readdir(dpath);

        for (let file of files) {
            const fpath = `${dpath}/${file}`;
            try {
                const fstat = await fs.promises.stat(fpath);
                if (fstat.isDirectory()) {
                    let dir = {
                        name: file + "",
                        children: [],
                        ctime: fstat.ctime,
                    };
                    tree.push(dir);
                    await this._createDirectoryIndex(fpath, dir.children, file);
                } else if (fstat.isFile()) {
                    tree.push({
                        name: file,
                        size: fstat.size,
                        ctime: fstat.ctime,
                        blocks: fstat.blocks,
                    });
                }
            } catch (e) {
                // Ignore and move on.
            }
        }

        return tree
    }


}

module.exports = FileSystem;
