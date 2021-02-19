/**
 *  This class manages all userData and tokens
 *  When a token is invalid or non existent it will try to get a valid token from the server.
 */
import util from '../util/Util';
import {Game} from "../Game";

interface TokenContainer {
    token: string,
    body: any,
    header: any,
    expiresAt: number
}

export class UserData {
    tokens: Map<string, TokenContainer> = new Map();
    game: Game;
    isAuthenticated = false;
    username: string;
    id: number;

    constructor(game: Game) {
        this.game = game;
        setInterval(() => {
            const time = Math.floor(new Date().getTime() / 1000);
            for (const token of this.tokens) {
                if (token[1].expiresAt < time + 6 * 60) {
                    console.log(`Token: ${token[0]} needs to be re issued`);
                }
            }
        }, 5 * 60 * 1000);
    }

    setUsername(username: string) {
        this.username = username;
    }

    setId(id: number) {
        this.id = id;
    }

    setAuthStatus(status: boolean) {
        this.isAuthenticated = status;
        if (!status) {
            this.tokens.clear();
        }
    }

    async getToken(scope: string) {
        const token = this.tokens.get(scope);
        if (token) {
            return token.token;
        } else {
            const json = await util.sendRequest("POST", "/auth/jwt", {scope: scope});
            const data = JSON.parse(json);
            const tokenContainer = UserData.destructureToken(data.token);
            this.tokens.set(scope, tokenContainer);
            return data.token;
        }
    }

    clearToken(scope: string) {
        this.tokens.delete(scope);
    }

    public inspectToken(scope: string) {
        const token = this.tokens.get(scope);
        if (!token)
            throw new Error("No Token exists for that scope");
        return {body: token.body, header: token.header};
    }

    private static destructureToken(token: string) {
        const base64 = token.split(".");
        const header = JSON.parse(atob(base64[0]));
        const body = JSON.parse(atob(base64[1]));
        const expiresIn = body.exp - body.iat;
        const expiresAt = Math.floor(new Date().getTime() / 1000) + expiresIn;
        return {header, body, token: token, expiresAt: expiresAt};
    }
}