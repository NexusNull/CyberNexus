const bcrypt = require("bcrypt");

class Authentication {
    constructor(app, DB) {
        this.tokens = new Map();
        this.DB = DB;
        app.post("/auth/login", async (req, res) => {
            let row = await this.DB.getUserByName(req.body.name);

            if (row && await bcrypt.compare(req.body.password, row.password)) {
                let authToken = this.generateAuthToken();
                this.tokens.set(authToken, row.id);
                res.setHeader("Content-Type", "application/json");
                res.send(`{"authToken":"${authToken}"}`);
            } else {
                res.status(400);
                res.setHeader("Content-Type", "application/json");
                res.send(`{"message":"Authentication failed"}`);
            }
        });

        app.post("/auth/register", async () => {
            //TODO later
        });

        app.post("/auth/validateToken", async (req, res) => {
            if (this.tokens.has(req.body.authToken)) {
                res.status(200);
                res.setHeader("Content-Type", "application/json");
                res.send(`{"valid":true,"message":"Invalid token"}`);
            } else {
                res.status(200);
                res.setHeader("Content-Type", "application/json");
                res.send(`{"valid":false,"message":"Invalid token"}`);
            }
        });
    }

    generateAuthToken() {
        let authToken = "";
        for (let i = 0; i < 32; i++) {
            authToken += "" + Math.floor(Math.random() * 10);
        }
        return authToken;
    };
}

module.exports = Authentication;