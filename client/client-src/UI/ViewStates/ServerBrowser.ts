import {ViewState} from "./ViewState";
import {Game} from "../../game";
import {UIController} from "../UIController";
import {InputController} from "../InputController";
import {util} from "../../util/Util";


class ServerBrowserViewState extends ViewState {
    servers: Map<number, Server>;

    constructor(game: Game, uiController: UIController, inputController: InputController) {
        super(game, uiController, inputController);
        this.servers = new Map();
    }

    async disable(): Promise<any> {
        this.uiController.uiElements.serverBrowserUI.hide();
    }

    async enable(): Promise<any> {
        this.uiController.uiElements.serverBrowserUI.display();
    }

    async setup(): Promise<any> {
        var self = this;
        let servers = await this.requestServerList();
        for (let server of servers) {
            this.uiController.uiElements.serverBrowserUI.addServerEntry(server.id, server);
            this.servers.set(server.id, server);
        }

        setTimeout(async function () {
            while (true) {
                if (self.uiController.activeViewState == self)
                    await self.pingAllServers();
                await util.sleep(2000);
            }
        })
    }

    async joinServer(id) {
        console.log(`joining server ${id}`);
        await this.uiController.changeViewState(this.uiController.viewStates.codeEditor);
    }

    async pingAllServers() {
        var self = this;
        for (let server of this.servers) {
            await this.ping(server[1].ip, server[1].port).then(function (ping) {
                self.uiController.uiElements.serverBrowserUI.updateServer(server[1].id, {ping: `${ping} ms`});
            }).catch(function () {
                self.uiController.uiElements.serverBrowserUI.updateServer(server[1].id, {ping: "-"})
            })
        }
    }

    async ping(ip, port): Promise<number> {
        let start = new Date();
        return new Promise(function (resolve, reject) {
            var xobj = new XMLHttpRequest();
            xobj.open('GET', `http://${ip}:${port}`, true);
            xobj.timeout = 2000;

            xobj.onreadystatechange = function () {
                if (xobj.readyState === XMLHttpRequest.DONE) {

                    if (xobj.status == 0)
                        reject("Request timed out");

                    resolve(new Date().getTime() - start.getTime());
                }
            };

            xobj.send();
        });
    }

    async requestServerList(): Promise<Array<Server>> {
        return new Promise(function (resolve, reject) {
            var xobj = new XMLHttpRequest();
            xobj.open('GET', "/serverList", true);
            xobj.timeout = 1000;

            xobj.onreadystatechange = function () {
                if (xobj.readyState === XMLHttpRequest.DONE) {
                    let data = null;

                    if (xobj.status == 0)
                        reject("Request timed out");


                    switch (xobj.status) {
                        case 200:
                        case 400:
                            try {
                                data = JSON.parse(xobj.responseText);
                            } catch (e) {
                                reject("Unable to parse Server response");
                                console.error(e);
                                break;
                            }

                            if (xobj.status == 200)
                                resolve(data);
                            else
                                reject(data.message);

                            break;
                        default:
                            reject(`Unknown status code in response: ${xobj.status}`);
                            break;
                    }
                }
            };

            xobj.send();
        });
    }
}

export {ServerBrowserViewState}