const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

class Authentication {
    constructor(app, DB) {
        this.tokens = new Map();
        this.DB = DB;
        app.post("/auth/login", async (req, res) => {
            let row = await this.DB.getUserByName(req.body.name);

            if (row && await bcrypt.compare(req.body.password, row.password)) {

                let authToken = this.generateAuthToken();
                this.tokens.set(authToken, row.id);

                req.session.user = {
                    username: row.username,
                    id: row.id
                };

                res.setHeader("Content-Type", "application/json");
                res.send(JSON.stringify({
                    username: row.username,
                    id: row.id
                }))
            } else {
                res.status(400);
                res.setHeader("Content-Type", "application/json");
                res.send(`{"message":"Authentication failed"}`);
            }
        });

        app.post("/auth/register", async () => {
            //TODO later
        });

        app.post("/auth/requestUserData", async (req, res) => {
            if (req.session.user) {
                res.status(200);
                res.setHeader("Content-Type", "application/json");

                res.send(JSON.stringify({
                    username: req.session.user.username,
                    id: req.session.user.id
                }));
            } else {
                res.status(403);
                res.setHeader("Content-Type", "application/json");
                res.send(`{"valid":false, "message":"Invalid token"}`);
            }
        });

        app.post("/auth/generateJWT", (req, res) => {
            console.log(req.body);

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