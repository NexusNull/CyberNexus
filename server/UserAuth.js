const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync('./keys/privateKey.pem');
const tokenTTL = 60 * 60 * 4;

class UserAuth {
    constructor(app, DB) {
        this.DB = DB;

        app.post("/auth/login", async (req, res) => {
            let row = await this.DB.getUserByName(req.body.name);

            if (row && await bcrypt.compare(req.body.password, row.password)) {

                req.session.user = {
                    username: row.username,
                    id: row.id,
                    sessionId: Math.floor(Math.random() * 10000000)
                };

                res.setHeader("Content-Type", "application/json");
                res.send(JSON.stringify({
                    username: row.username,
                    id: row.id,
                }));
            } else {
                res.status(400);
                res.setHeader("Content-Type", "application/json");
                res.send(`{"message":"Authentication failed"}`);
            }
        });

        app.post("/auth/register", async () => {
            //TODO later
        });

        app.get("/auth/self", async (req, res) => {
            if (req.session.user) {
                res.status(200);
                res.setHeader("Content-Type", "application/json");

                res.send(JSON.stringify({
                    username: req.session.user.username,
                    id: req.session.user.id,
                }));
            } else {
                res.status(403);
                res.setHeader("Content-Type", "application/json");
                res.send(`{"valid":false, "message":"Invalid token"}`);
            }
        });

        app.get("/auth/jwt", async (req, res) => {
            if (req.session.user) {

                const token = jwt.sign({
                    uid: req.session.user.id,
                    ip: req.connection.remoteAddress,
                    paths: [
                        {path: "/1/", perms: ["canRead", "canWrite"]}
                    ],
                    admin: false,
                }, privateKey, {
                    algorithm: 'RS256',
                    expiresIn: tokenTTL
                });
                res.status(200);
                res.setHeader("Content-Type", "application/json");

                res.send(JSON.stringify({
                    token: token,
                }));

            } else {
                res.status(403);
                res.setHeader("Content-Type", "application/json");
                res.send(`{"valid":false, "message":"Invalid token"}`);
            }

        });
    }
}

module.exports = UserAuth;
