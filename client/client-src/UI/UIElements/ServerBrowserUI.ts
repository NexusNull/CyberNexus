import {UIController} from '../UIController';
import {ServerElement} from "../../definitions/Server";

export class ServerBrowserUI {
    uiController: UIController;
    element: HTMLDivElement;
    visible: boolean;
    servers: Map<number, ServerElement>;
    serverListElement: HTMLDivElement;

    constructor(uiController: UIController) {
        this.uiController = uiController;
        this.element = <HTMLDivElement>document.getElementById('serverBrowser');
        this.servers = new Map();
        this.serverListElement = <HTMLDivElement>document.getElementById('serverList');
    }

    removeServer(id: number): void {
        const entry = this.servers.get(id);
        this.serverListElement.removeChild(entry.serverEntryElement);
        this.servers.delete(id);
    }

    updateServer(id: number, data: any): void {
        const entry = this.servers.get(id);
        if (data.name) {
            entry.nameDisplay.innerText = data.name;
        }

        if (data.location) {
            entry.locationDisplay.innerText = data.location;
        }

        if (data.players) {
            entry.playersDisplay.innerText = '' + data.players;
        }
        if (data.maxPlayers) {
            entry.maxPlayersDisplay.innerText = '' + data.maxPlayers;
        }

        if (data.ping) {
            entry.pingDisplay.innerText = '' + data.ping;
        }
    }

    addServerEntry(id, data): void {
        const element = this.serverEntryTemplate();
        element.joinButton.addEventListener('click', () => {
            this.uiController.viewStates.serverBrowser.joinServer(id);
        });
        this.servers.set(id, element);
        this.updateServer(id, data);
        this.serverListElement.appendChild(element.serverEntryElement);
    }

    serverEntryTemplate(): ServerElement {
        const template = `                
            <div class="serverName">
                Europa I
            </div>
            <div class="serverLocation">
                EU
            </div>
            <div class="serverPlayerCount">
                <span class="playerCount">12</span>
                /
                <span class="playerMaximum">22</span>
                <img src="icons/player.svg" alt="playerMaximum" class="icon"> <!--  player icon -->
            </div>

            <div class="serverPing">
                <span class="ping">pinging ...</span>
                <img src="icons/ping.svg" alt="ping in ms" class="icon"> <!--  ping icon -->
            </div>
            <div class="joinButton">
                <button>Join</button>
            </div>`;

        const element = <HTMLDivElement>document.createElement('div');
        element.classList.add('serverEntry');
        element.innerHTML = template;

        return {
            serverEntryElement: element,
            nameDisplay: <HTMLSpanElement>element.getElementsByClassName('serverName')[0],
            locationDisplay: <HTMLSpanElement>element.getElementsByClassName('serverLocation')[0],
            playersDisplay: <HTMLSpanElement>element.getElementsByClassName('playerCount')[0],
            maxPlayersDisplay: <HTMLSpanElement>element.getElementsByClassName('playerMaximum')[0],
            pingDisplay: <HTMLSpanElement>element.getElementsByClassName('ping')[0],
            joinButton: <HTMLButtonElement>element.getElementsByClassName('joinButton')[0].getElementsByTagName('button')[0],
        };
    }

    display(): void {
        this.element.classList.remove('hidden');
        this.visible = true;
    }

    hide(): void {
        this.element.classList.add('hidden');
        this.visible = false;
    }
}
