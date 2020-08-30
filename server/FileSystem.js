const fs = require("fs");
const path = require("path");
const clientDir = path.join(process.cwd(), "/server/data/users");

class FileSystem {


    constructor(app, DB, auth) {

        app.post("/fs/*", async (req, res) => {// add a resource

            let user = {
                name: "somename",
                id: 1,
            };


            let url = path.normalize(req.url.replace("fs/", ""));
            let objectPath = path.join(clientDir, "" + user.id, url);

            if (objectPath.endsWith(path.sep)) {
                //create folder
                let name = path.parse(objectPath).base;
                if (this.validateDirectoryName(name)) {
                    try {
                        console.log(await fs.promises.mkdir(objectPath));
                        res.send("ok")
                    } catch (e) {
                        res.status(500).send("failed");
                        return;
                    }
                } else {
                    res.status(400).send("failed: invalid Directory name")
                }
            } else {
                let name = path.parse(objectPath).base;
                if (this.validateFileName(name)) {
                    try {
                        console.log(await fs.promises.writeFile(objectPath, req.body));
                        res.send("ok")
                    } catch (e) {
                        res.status(500).send("failed");
                        return
                    }
                } else {
                    res.status(400).send("failed: invalid File name")
                }
            }
        });

        app.delete("/fs/*", async (req, res) => {

            let user = {
                name: "somename",
                id: 1,
            };

            let url = path.normalize(req.url.replace("fs/", ""));

            if (url === path.sep) {
                res.status(403).send("forbidden");
                return;
            }
            let objectPath = path.join(clientDir, "" + user.id, url);

            let stats;
            try {
                stats = await fs.promises.stat(objectPath);
            } catch (e) {
                console.log(`User: ${user.name} tried to delete ${objectPath} which doesn't exist.`)
                res.status(404).send(" 404: file or directory not found");
                return;
            }

            if (stats.isDirectory()) {
                try {
                    await fs.promises.rmdir(objectPath);
                } catch (e) {
                    res.status(400).send("Unable to delete Directory");
                    return;
                }
                res.send("ok");
                return;
            } else if (stats.isFile()) {
                try {
                    await fs.promises.unlink(objectPath);
                } catch (e) {
                    res.status(400).send("Unable to delete File");
                    return;
                }
                res.send("ok");
                return;
            }

        });

        app.get("/fs/*", async (req, res) => {
            let user = {
                username: "somename",
                id: 1,
            };

            let url = path.normalize(req.url.replace("fs/", ""));
            let objectPath = path.join(clientDir, "" + user.id, url);
            let stats;

            try {
                stats = await fs.promises.stat(objectPath);
            } catch (e) {
                console.log(`User: ${user.name} tried to access ${objectPath} which doesn't exist.`)
                res.status(404).send(" 404: file or directory not found");
                return;
            }

            if (stats.isDirectory()) {
                let elements;
                try {
                    elements = await fs.promises.readdir(objectPath);
                } catch (e) {
                    console.log(`Couldn't read Folder ${objectPath}`);
                    res.status(500).send("internal Server error");
                    return;
                }

                let response = [];
                for (let element of elements) {
                    let elementPath = path.join(objectPath, element);
                    let stats;
                    try {
                        stats = await fs.promises.stat(elementPath);
                    } catch (e) {
                        console.error(`Failed to get stats for element ${elementPath}`);
                        res.status(500).send("internal Server error")
                        continue;
                    }

                    let data = {
                        path: path.join(url, element),
                    };

                    if (stats.isDirectory()) {
                        data.type = "dir";
                    } else if (stats.isFile()) {
                        data.type = "file";
                        data.size = stats.size;
                    } else {
                        continue;
                    }

                    response.push(data);
                }
                res.type("json");
                res.send(JSON.stringify(response))
                return;
            } else if (stats.isFile()) { //It may be a symlink which we do not want to take
                res.sendFile(objectPath);
                return;
            }

            res.status(404).send(" 404: file or directory not found");
            console.log(`User: ${user.name} tried to access ${objectPath} which isn't a file or a directory exist.`);
        });
    }

    validateDirectoryName(name) {
        return /^[0-9a-zA-Z_\-]{0,32}$/.test(name);
    }

    validateFileName(name) {
        return /^[0-9a-zA-Z_\-]{0,32}\.[0-9a-zA-Z_\-]{1,32}$/.test(name);
    }

    validatePath(url) {
        url = path.normalize(url);
        console.log(url)
        let parts = url.split(path.sep).slice(1);
        let valid = true;
        for (let part of parts) {
            if (!/^[0-9a-zA-Z_. ]{0,32}$/.test(part)) {
                valid = false;
                break;
            }
            if (!/[0-9a-zA-Z]/.test(part)) { // must contain at least 1 number or character
                valid = false;
                break;
            }
            if (/^[0-9a-zA-Z_. ]+\.$/.test(part)) { // must contain at least 1 number or character
                valid = false;
                break;
            }
        }
        return valid;
    }

}

module.exports = FileSystem;