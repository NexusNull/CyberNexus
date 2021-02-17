const webdav = require('webdav-server').v2;
const express = require('express');
const jwt = require("jsonwebtoken");
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require("crypto")
const HTTPJWTAuthentication = require("./HTTPJWTAuthentication");

const directory = path.join(__dirname,"data");

const privateKey = fs.readFileSync('./keys/privateKey.pem');
const publicKey = fs.readFileSync('./keys/publicKey.pem');
console.log(directory)

const token = jwt.sign({
    uid: "1",
    paths: [
        {path: "/1/", perms: ["canRead", "canWrite"]}
    ],
    admin: false,
}, privateKey, {
    algorithm: 'RS256',
    expiresIn: "254h"
});

console.log(`Bearer ${token}`)
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
    console.log(req.header("origin"));
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
