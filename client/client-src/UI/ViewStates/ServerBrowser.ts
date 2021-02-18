import {ViewState} from './ViewState';
import {Game} from '../../Game';
import {UIController} from '../UIController';
import {InputController} from '../InputController';
import util from '../../util/Util';
import {Server} from "../../definitions/Server";


export class ServerBrowserViewState extends ViewState {
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
        const servers = await this.requestServerList();
        for (const server of servers) {
            this.uiController.uiElements.serverBrowserUI.addServerEntry(server.id, server);
            this.servers.set(server.id, server);
        }

        setInterval(async () => {
            if (this.uiController.activeViewState == this) {
                await this.pingAllServers();
            }
        }, 2000);
    }

    async joinServer(id) {
        console.log(`joining server ${id}`);
        await this.uiController.changeViewState(this.uiController.viewStates.codeEditor);
    }

    async pingAllServers() {
        for (const server of this.servers) {
            await this.ping(server[1].ip, server[1].port).then((ping) => {
                this.uiController.uiElements.serverBrowserUI.updateServer(server[1].id, {ping: `${ping} ms`});
            }).catch(() => {
                this.uiController.uiElements.serverBrowserUI.updateServer(server[1].id, {ping: '-'});
            });
        }
    }

    async ping(ip, port): Promise<number> {
        const start = new Date();
        return new Promise((resolve, reject) => {
            const xobj = new XMLHttpRequest();
            xobj.open('GET', `${window.location.protocol}//${ip}:${port}`, true);
            xobj.timeout = 2000;

            xobj.onreadystatechange = () => {
                if (xobj.readyState === XMLHttpRequest.DONE) {
                    if (xobj.status == 0) {
                        reject('Request timed out');
                    }

                    resolve(new Date().getTime() - start.getTime());
                }
            };

            xobj.send();
        });
    }

    async requestServerList(): Promise<Array<Server>> {
        return new Promise((resolve, reject) => {
            const xobj = new XMLHttpRequest();
            xobj.open('GET', '/serverList', true);
            xobj.timeout = 1000;

            xobj.onreadystatechange = () => {
                if (xobj.readyState === XMLHttpRequest.DONE) {
                    let data = null;

                    if (xobj.status == 0) {
                        reject('Request timed out');
                    }


                    switch (xobj.status) {
                    case 200:
                    case 400:
                        try {
                            data = JSON.parse(xobj.responseText);
                        } catch (e) {
                            reject('Unable to parse Server response');
                            console.error(e);
                            break;
                        }

                        if (xobj.status == 200) {
                            resolve(data);
                        } else {
                            reject(data.message);
                        }

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

