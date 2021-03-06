import {ViewState} from './ViewState';
import {Game} from '../../Game';
import {UIController} from '../UIController';
import {InputController} from '../InputController';
import {Server, ServerData} from "../../definitions/Server";


export class ServerBrowserViewState implements ViewState {
    isSetup: boolean;
    game: Game;
    uiController: UIController;
    inputController: InputController;
    servers: Map<number, Server>;

    constructor(game: Game, uiController: UIController, inputController: InputController) {

        this.game = game;
        this.uiController = uiController;
        this.inputController = inputController;
        this.servers = new Map();
    }

    async disable(): Promise<void> {
        this.uiController.uiElements.serverBrowserUI.hide();
    }

    async enable(): Promise<void> {
        this.uiController.uiElements.serverBrowserUI.display();
    }

    async setup(): Promise<void> {
        const servers = await this.requestServerList();
        for (const serverData of servers) {
            const server = {
                id: serverData.id,
                name: serverData.name,
                location: serverData.location,

                ip: serverData.ip,
                port: serverData.port,

                players: serverData.players,
                maxPlayers: serverData.maxPlayers,

                ping: "-"
            };

            this.uiController.uiElements.serverBrowserUI.addServerEntry(server.id, server);
            this.servers.set(server.id, server);
        }

        setInterval(async () => {
            if (this.uiController.activeViewState == this) {
                await this.pingAllServers();
            }
        }, 2000);
        this.isSetup = true;
    }

    async joinServer(id: number): Promise<void> {
        console.log(`joining server ${id}`);
        await this.uiController.changeViewState(this.uiController.viewStates.codeEditor);
    }

    async pingAllServers(): Promise<void> {
        for (const server of this.servers) {
            await this.ping(server[1].ip, server[1].port).then((ping) => {
                this.uiController.uiElements.serverBrowserUI.updateServer(server[1].id, {ping: `${ping} ms`});
            }).catch(() => {
                this.uiController.uiElements.serverBrowserUI.updateServer(server[1].id, {ping: '-'});
            });
        }
    }

    async ping(ip: string, port: number): Promise<number> {
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

    async requestServerList(): Promise<ServerData[]> {
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

