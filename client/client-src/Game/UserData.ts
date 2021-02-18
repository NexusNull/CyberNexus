/**
 *  This class manages all userData and tokens
 *  When a token is invalid or non existent it will try to get a valid token from the server.
 */
import util from '../util/Util';
import {Game} from "../Game";

export class UserData {
    tokens: Map<string, string> = new Map();
    game: Game;
    isAuthenticated = false;
    username: string;
    id: number;

    constructor(game: Game) {
        this.game = game;
    }

    setUsername(username) {
        this.username = username;
    }

    setId(id) {
        this.id = id;
    }

    setAuthStatus(status) {
        this.isAuthenticated = status;
        if (!status) {
            this.tokens.clear();
        }
    }

    async getToken(scope) {
        const token = this.tokens.get(scope);
        if (token) {
            return token;
        } else {
            const json = await util.sendRequest("POST", "/auth/jwt", {scope: scope});
            const data = JSON.parse(json);
            this.tokens.set(scope, data.token);
            return data.token;
        }
    }

    clearToken(scope) {
        this.tokens.delete(scope);
    }

    inspectToken(scope) {
        const token = this.tokens.get(scope);
        if (!token)
            throw new Error("No Token exists for that scope");
        const base64 = token.split(".");
        const header = JSON.parse(atob(base64[0]));
        const body = JSON.parse(atob(base64[1]));
        return {header, body};
    }

}