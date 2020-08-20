const express = require('express');
const app = express();
const DB = require("./DB");

const Authentication = require("./Authentication");
const ServerList = require("./ServerList");
const FileSystem = require("./FileSystem")
const bodyParser = require('body-parser');
app.use(express.json());


class WebServer {
    constructor() {
        this.socketOpen = false;
        this.defaultPort = 80;
        this.DB = new DB();

    }

    async openSocket(port) {
        const self = this;
        if (this.socketOpen)
            throw Error("WebServer already running.");
        this.socketOpen = true;
        await this.DB.init();
        port = (port) ? port : this.defaultPort;

        app.use("/", function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            next();
        });
        app.use('/', express.static(__dirname + '/../client/public'));
        app.use(bodyParser.text());
        let serverList = new ServerList(app, this.DB);
        let authentication = new Authentication(app, this.DB);
        let fileSystem = new FileSystem(app, this.DB, authentication);

        app.use(function (req, res) {
            res.status(404).send(" 404: Page not found");
        });
        app.listen(port, function () {
            console.log('WebServer listening on port ' + port + '.');
        });
    };


}

(new WebServer()).openSocket(8080);