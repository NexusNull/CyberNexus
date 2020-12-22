const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync('./keys/privateKey.pem');
const publicKey = fs.readFileSync('./keys/publicKey.pem');
const tokenTTL = 60 * 60 * 4;

class Authentication {
    constructor(app, DB) {
        this.DB = DB;
        app.use("/", function (req, res, next) {
            console.log(req.session.user)
            console.log(req.cookies);
            let validToken = false;
            if (req.session.user) {
                if (req.cookies.jwt) {
                    try {
                        validToken = jwt.verify(req.cookies.jwt, publicKey, {algorithm: 'RS256'});
                    } catch (e) {
                        console.log(e);
                    }
                }
                if (!validToken) {
                    const token = jwt.sign({
                        userId: req.session.user.id,
                        parentId: req.session.user.sessionId
                    }, privateKey, {
                        algorithm: 'RS256',
                        expiresIn: tokenTTL
                    });
                    res.setHeader("Set-Cookie", `jwt=${token}; Max-Age=${tokenTTL}; HttpOnly; Path=/`);
                }
            }
            next();
        });


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

        app.post("/auth/requestUserData", async (req, res) => {
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

    }
}

module.exports = Authentication;
