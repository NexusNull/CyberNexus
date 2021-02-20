const webdav = require('webdav-server').v2;
const express = require('express');
const fs = require('fs');
const path = require('path');
const HTTPJWTAuthentication = require("./HTTPJWTAuthentication");

const directory = path.join(__dirname,"data");

const publicKey = fs.readFileSync('./keys/publicKey.pem');

// Privilege manager (tells which users can access which files/folders)
const privilegeManager = new webdav.SimplePathPrivilegeManager();
const server = new webdav.WebDAVServer({
    rootFileSystem: new webdav.PhysicalFileSystem(directory),
    httpAuthentication: new HTTPJWTAuthentication(privilegeManager, "webdav", publicKey),
    privilegeManager: privilegeManager
});

const app = express();
app.use(express.static("./"));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.header("origin"));
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS")
        res.status(204).send();
    else
        next();
});

app.listen(2000);
app.use(webdav.extensions.express('/fs', server));
