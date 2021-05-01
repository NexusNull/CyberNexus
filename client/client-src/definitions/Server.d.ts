export interface Server {
    id: number,
    name: string,
    location: string,

    ip: string,
    port: number,

    players: number,
    maxPlayers: number,

    ping: number
}

export interface ServerElement {
    serverEntryElement: HTMLDivElement;

    nameDisplay: HTMLSpanElement;
    locationDisplay: HTMLSpanElement;

    playersDisplay: HTMLSpanElement;
    maxPlayersDisplay: HTMLSpanElement;

    pingDisplay: HTMLSpanElement;
    joinButton: HTMLButtonElement;
}
