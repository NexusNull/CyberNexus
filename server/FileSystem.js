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

    createIndex() {
        let start = process.hrtime();
        let dirPath = path.join(clientDir, this.userId + "/");
        const fstat = fs.statSync(dirPath);
        let dir = {
            name: this.userId,
            children: [],
            ctime: fstat.ctime,

        };
        let tree = this._createDirectoryIndex(dirPath, dir.children, "/");
        let time = process.hrtime(start);
        if (time[0] > 5) {
            console.warn(`Directory index of ${dir} took ${time[0]} seconds, that is too long`);
        }
        return dir;
    }

    _createDirectoryIndex(dpath, tree, name) {
        const files = fs.readdirSync(dpath);

        for (let file of files) {
            const fpath = `${dpath}/${file}`;
            try {
                const fstat = fs.statSync(fpath);
                if (fstat.isDirectory()) {
                    let dir = {
                        name: file,
                        children: [],
                        ctime: fstat.ctime,

                    };
                    tree.push(dir);
                    this._createDirectoryIndex(fpath, dir.children, file);
                } else if (fstat.isFile()) {
                    tree.push({
                        name: file,
                        size: fstat.size,
                        ctime: fstat.ctime,
                        blksize: fstat.blksize,
                        blocks: fstat.blocks,
                    })
                }
            } catch (e) {
                // Ignore and move on.
            }
        }

        return tree
    }


}

let fileSystem = new FileSystem(1);
console.log(JSON.stringify(fileSystem.createIndex(), null, 4));