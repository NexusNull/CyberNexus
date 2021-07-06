/**
 *  This class manages all userData and tokens
 *  When a token is invalid or non existent it will try to get a valid token from the server.
 */
import util from '../util/Util';
import {Game} from "../Game";
import {EventSystem} from "../util/EventSystem";


export interface GenericJWTContainer {
    token: string,
    header: { alg: string, typ: string },
    body: { exp: number, iat: number, scope: string },
    expiresAt: number
}

export interface PathPermissions {
    path: string,
    perms: Array<"canRead" | "canWrite">
}

export interface WebDavJWTContainer extends GenericJWTContainer {
    body: {
        uid: number
        ip: string,
        paths: Array<PathPermissions>,
        admin: boolean,
        scope: "webdav",

        exp: number,
        iat: number
    },
}

export class UserData extends EventSystem {
    tokens: Map<string, GenericJWTContainer> = new Map();
    game: Game;
    isAuthenticated = false;
    username: string;
    id: number;

    constructor(game: Game) {
        super();
        this.game = game;
        setInterval(() => {
            const time = Math.floor(new Date().getTime() / 1000);
            for (const token of this.tokens) {
                if (token[1].expiresAt < time + 6 * 60) {
                    this.clearToken(token[0]);
                    this.emit("tokenTimeout", util.clone(token));
                    console.log(`Token: ${token[0]} needs to be re issued`);
                }
            }
        }, 5 * 60 * 1000);
    }

    setUsername(username: string): void {
        this.username = username;
    }

    setId(id: number): void {
        this.id = id;
    }

    setAuthStatus(status: boolean): void {
        this.isAuthenticated = status;
        if (!status) {
            this.tokens.clear();
        } else {
            this.fetchTokens();
        }
    }

    async fetchTokens(): Promise<void> {
        //ignore promise
        await this.getToken("webdav");
    }

    async getToken(scope: string): Promise<string> {
        const token = this.tokens.get(scope);
        if (token) {
            return token.token;
        } else {
            const json = await util.sendRequest("POST", "/auth/jwt", {scope: scope});
            const data = JSON.parse(json);
            const tokenContainer = UserData.destructureToken(data.token);
            await this.emit("tokenIssued", util.clone(tokenContainer));
            this.tokens.set(scope, tokenContainer);
            return data.token;
        }
    }

    clearToken(scope: string): void {
        this.tokens.delete(scope);
    }

    public inspectToken(scope: string): GenericJWTContainer {
        const token = this.tokens.get(scope);
        if (!token)
            throw new Error("No Token exists for that scope");
        return util.clone(token);
    }

    private static destructureToken(token: string): GenericJWTContainer {
        const base64 = token.split(".");
        const header = JSON.parse(atob(base64[0]));
        const body = JSON.parse(atob(base64[1]));
        const expiresIn = body.exp - body.iat;
        const expiresAt = Math.floor(new Date().getTime() / 1000) + expiresIn;
        return {header, body, token: token, expiresAt: expiresAt};
    }
}