interface Server {
    id: number,
    name: string,
    location: string,

    ip: string,
    port: number,

    players: number,
    maxPlayers: number,

    ping: number
}

interface ServerElement {
    serverEntryElement: HTMLDivElement;

    nameDisplay: HTMLSpanElement;
    locationDisplay: HTMLSpanElement;

    playersDisplay: HTMLSpanElement;
    maxPlayersDisplay: HTMLSpanElement;

    pingDisplay: HTMLSpanElement;
    joinButton: HTMLButtonElement;
}
