import {UIController} from "../UIController";

export class ServerBrowserUI {
    uiController: UIController;
    element: HTMLDivElement;
    visible: boolean;
    servers: Map<number, ServerElement>;
    serverListElement: HTMLDivElement;

    constructor(uiController) {
        this.uiController = uiController;
        this.element = <HTMLDivElement>document.getElementById("serverBrowser");
        this.servers = new Map();
        this.serverListElement = <HTMLDivElement>document.getElementById("serverList");


    }

    removeServer(id) {
        let entry = this.servers.get(id);
        this.serverListElement.removeChild(entry.serverEntryElement);
        this.servers.delete(id);
    }

    updateServer(id: number, data: any) {
        let entry = this.servers.get(id);
        if (data.name)
            entry.nameDisplay.innerText = data.name;

        if (data.location)
            entry.locationDisplay.innerText = data.location;

        if (data.players)
            entry.playersDisplay.innerText = '' + data.players;
        if (data.maxPlayers)
            entry.maxPlayersDisplay.innerText = '' + data.maxPlayers;

        if (data.ping)
            entry.pingDisplay.innerText = '' + data.ping;

    }

    addServerEntry(id, data) {
        var self = this;
        let element = this.serverEntryTemplate();
        element.joinButton.addEventListener("click", function () {
            self.uiController.viewStates.serverBrowser.joinServer(id);
        });
        this.servers.set(id, element);
        this.updateServer(id, data);
        this.serverListElement.appendChild(element.serverEntryElement);
    }

    serverEntryTemplate(): ServerElement {
        var template = `                
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

        let element = <HTMLDivElement>document.createElement("div");
        element.classList.add("serverEntry");
        element.innerHTML = template;

        return {
            serverEntryElement: element,
            nameDisplay: <HTMLSpanElement>element.getElementsByClassName("serverName")[0],
            locationDisplay: <HTMLSpanElement>element.getElementsByClassName("serverLocation")[0],
            playersDisplay: <HTMLSpanElement>element.getElementsByClassName("playerCount")[0],
            maxPlayersDisplay: <HTMLSpanElement>element.getElementsByClassName("playerMaximum")[0],
            pingDisplay: <HTMLSpanElement>element.getElementsByClassName("ping")[0],
            joinButton: <HTMLButtonElement>element.getElementsByClassName("joinButton")[0].getElementsByTagName("button")[0]
        }
    }

    display() {
        this.element.classList.remove("hidden");
        this.visible = true;
    };

    hide() {
        this.element.classList.add("hidden");
        this.visible = false;
    };
}