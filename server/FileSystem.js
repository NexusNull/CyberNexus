const fs = require("fs");
const path = require("path");
const clientDir = path.join(process.cwd(), "/server/data/users");

class FileSystem {


    constructor(app, DB, auth) {

        app.post("/fs/*", (req, res) => {// add a resource
            console.log(req)


        });
        app.put("/fs/*", () => {// modify a resource

        });
        app.delete("/fs/*", () => {

        });

        app.get("/fs/*", async (req, res) => {

            let user = {
                username: "somename",
                id: 1,
            };

            let url = path.normalize(req.url.replace("fs/", ""));
            let objectPath = path.join(clientDir, ""+user.id, url);
            let stats;

            try {
                stats = await fs.promises.stat(objectPath);
            } catch (e) {
                console.log(`User: ${user.name} tried to access ${objectPath} which doesn't exist.`)
                res.status(404).send(" 404: file or directory not found");
                return;
            }

            if (stats.isDirectory()) {
                let elements
                try {
                    elements = await fs.promises.readdir(objectPath);
                } catch (e) {
                    console.log(`Couldn't read Folder ${objectPath}`);
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
            console.log(`User: ${username} tried to access ${objectPath} which isn't a file or a directory exist.`);
        });
    }
}

module.exports = FileSystem;