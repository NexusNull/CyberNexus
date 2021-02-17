const express = require('express');
const app = express();
const DB = require("./DB");
const UserAuth = require("./UserAuth");

const ServerAuth = require("./ServerAuth");
const ServerList = require("./ServerListRoute");
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.set("env", "production");
app.use(express.json());
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        console.log(`${err.type} ${err.message}`);
        res.status(400).send(JSON.stringify({message: "Bad Request Error"}))
    } else {
        next();
    }
});

app.use(cookieParser());
app.use(session({
    secret: '94fc9999c757efbc752f27e66c3981a4',
    resave: false,
    saveUninitialized: false,
    cookie: {httpOnly: true}
}));

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


        app.use('/', express.static(__dirname + '/../client/public'));
        app.use(bodyParser.text());

        let userAuth = new UserAuth(app, this.DB);
        let serverList = new ServerList(app, this.DB);
        let serverAuth = new ServerAuth(app, userAuth);

        app.use(function (req, res) {
            res.status(404).send(" 404: Page not found");
        });
        app.listen(port, function () {
            console.log('WebServer listening on port ' + port + '.');
        });
    };
}

(new WebServer()).openSocket(8080);
