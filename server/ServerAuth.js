const fetch = require('node-fetch');
const Socket = require("socket.io-client");
const fs = require("fs");
const publicKey = fs.readFileSync('./keys/publicKey.pem');

class ServerAuth {
    constructor(app, serverList) {
        app.post("/registerServer", async (req, res) => {

            if (typeof req.body !== "object" ||
                typeof req.body.name !== "string" ||
                req.body.name.length > 64 ||
                typeof req.body.location !== "string" ||
                req.body.location.length > 4 ||
                typeof req.body.url !== "string" ||
                req.body.url > 32
            ) {
                res.status(400).send(JSON.stringify({message: "Invalid parameters on server registration"}))
                return;
            }

            /*
             ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
             │                                              href                                              │
             ├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
             │ protocol │  │        auth         │          host          │           path            │ hash  │
             │          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
             │          │  │                     │    hostname     │ port │ pathname │     search     │       │
             │          │  │                     │                 │      │          ├─┬──────────────┤       │
             │          │  │                     │                 │      │          │ │    query     │       │
             "  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
             │          │  │          │          │    hostname     │ port │          │                │       │
             │          │  │          │          ├─────────────────┴──────┤          │                │       │
             │ protocol │  │ username │ password │          host          │          │                │       │
             ├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
             │   origin    │                     │         origin         │ pathname │     search     │ hash  │
             ├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
             │                                              href                                              │
             └────────────────────────────────────────────────────────────────────────────────────────────────┘
             */
            let serverUrl = new URL(req.body.url);
            if (serverUrl.protocol !== "ws:") {
                res.status(400).send(JSON.stringify({message: "Invalid url, protocol has to be wss:"}))
                return;
            }
            if (serverUrl.username !== "" || serverUrl.password !== "") {
                res.status(400).send(JSON.stringify({message: "Invalid url, authentication is not allowed"}))
                return;
            }
            if (serverUrl.search !== "") {
                res.status(400).send(JSON.stringify({message: "Invalid url, query is not allowed"}))
                return;
            }
            if (serverUrl.hash !== "") {
                res.status(400).send(JSON.stringify({message: "Invalid url, hash is not allowed"}))
                return;
            }
            res.status(200).send(JSON.stringify({massage: "ok", publicKey: publicKey}))

            setTimeout(async () => {
                try {
                    let socket = Socket(serverUrl.toString(), {
                        autoConnect: false,
                        extraHeaders: {
                            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
                            referer: "http://adventure.land/",
                            "accept-language": "en-US,en;q=0.5"
                        }
                    });
                    socket.emit("welcome", "");
                } catch (e) {

                }
            }, 5000);

        });
    }
}

module.exports = ServerAuth