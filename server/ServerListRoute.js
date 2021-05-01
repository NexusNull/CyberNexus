class ServerListRoute {
    constructor(app, db) {
        this.servers = new Map();

        this.servers.set(1, {
            name: "Europa Iasdasdasdasdasdasd",
            location: "EU",

            ip: "localhost",
            port: 8080,

            players: 1,
            maxPlayers: 2,
        });

        app.get("/serverList", async (req, res) => {
            //TODO use a cache later
            res.status(200);
            res.setHeader("Content-Type", "application/json");

            let servers = [];
            for (let server of this.servers) {
                let id = server[0];
                let serverData = server[1];
                serverData["id"] = id;
                servers.push(serverData);
            }

            res.send(JSON.stringify(servers, null, 2));
        });
    }

}

module.exports = ServerListRoute;