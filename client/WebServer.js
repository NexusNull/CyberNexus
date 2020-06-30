const express = require('express');
const app = express();

class WebServer {
    constructor() {
        this.socketOpen = false;
        this.defaultPort = 80
    }

    openSocket(port) {
        if (this.socketOpen)
            throw Error("WebServer already running.");
        this.socketOpen = true;

        port = (port) ? port : this.defaultPort;

        app.use('/', express.static(__dirname + '/public'));

        app.use(function (req, res) {
            res.status(404).send(" 404: Page not found");
        });

        app.listen(port, function () {
            console.log('WebServer listening on port ' + port + '.');
        });
    };
}

(new WebServer()).openSocket(8080);