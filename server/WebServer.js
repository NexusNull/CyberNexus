const express = require('express');
const app = express();
const DB = require("./DB");
const bcrypt = require("bcrypt");


app.use(express.json());


class WebServer {
    constructor() {
        this.socketOpen = false;
        this.defaultPort = 80;
        this.DB = new DB();

        this.servers = new Map();
        this.servers.set(1, {
            name: "Europa Iasdasdasdasdasdasd",
            location: "EU",

            ip: "185.228.139.97",
            port: 8080,

            players: 1,
            maxPlayers: 2,
        });

        this.servers.set(2, {
            name: "Europa II",
            location: "EU",

            ip: "185.228.139.97",
            port: 8080,

            players: 1,
            maxPlayers: 2,
        });

        this.servers.set(3, {
            name: "Europa III",
            location: "EU",

            ip: "185.228.139.97",
            port: 8080,

            players: 1,
            maxPlayers: 2,
        });
        this.tokens = new Map();
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

        app.post("/auth/login", async function (req, res) {

            let row = await self.DB.getUserByName(req.body.name);

            if (row && await bcrypt.compare(req.body.password, row.password)) {
                let authToken = self.generateAuthToken();
                self.tokens.set(authToken, row.id);
                res.setHeader("Content-Type", "application/json");
                res.send(`{"authToken":"${authToken}"}`);
            } else {
                res.status(400);
                res.setHeader("Content-Type", "application/json");
                res.send(`{"message":"Authentication failed"}`);
            }

        });

        app.post("/auth/register", async function () {
            //TODO later
        });

        app.post("/auth/validateToken", async function (req, res) {
            if (self.tokens.has(req.body.authToken)) {
                res.status(200);
                res.setHeader("Content-Type", "application/json");
                res.send(`{"valid":true,"message":"Invalid token"}`);
            } else {
                res.status(200);
                res.setHeader("Content-Type", "application/json");
                res.send(`{"valid":false,"message":"Invalid token"}`);
            }
        });


        app.get("/serverList", async function (req, res) {
            //TODO use a cache later
            res.status(200);
            res.setHeader("Content-Type", "application/json");

            let servers = [];
            for (let server of self.servers) {
                let id = server[0];
                let serverData = server[1];
                serverData["id"] = id;
                servers.push(serverData);
            }

            res.send(JSON.stringify(servers, null, 2));
        });


        app.use(function (req, res) {
            res.status(404).send(" 404: Page not found");
        });

        app.listen(port, function () {
            console.log('WebServer listening on port ' + port + '.');
        });
    };

    generateAuthToken() {
        let authToken = "";
        for (let i = 0; i < 32; i++) {
            authToken += "" + Math.floor(Math.random() * 10);
        }
        return authToken;
    };
}

(new WebServer()).openSocket(8080);