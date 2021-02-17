import {ViewState} from "./ViewState";
import {Game} from "../../Game";
import {UIController} from "../UIController";
import {InputController} from "../InputController";
import util from "../../util/Util";

class AuthViewState extends ViewState {
    constructor(game: Game, uiController: UIController, inputController: InputController) {
        super(game, uiController, inputController);

    }

    async disable(): Promise<any> {
        this.uiController.uiElements.authUI.hide();
    }

    async enable(): Promise<any> {
        try {
            let userData = JSON.parse(await util.sendRequest("GET","/auth/self"));
            this.game.setUserData(userData.id, userData.username);
            this.authCompleted();
            return;
        } catch (e) {
            console.error(e);
        }

        this.uiController.uiElements.authUI.display();
    }

    async setup(): Promise<any> {

    }

    authCompleted() {
        this.uiController.uiElements.authUI.clearForms();
        this.uiController.changeViewState(this.uiController.viewStates.serverBrowser);
    }

    async login(name, password) {
        try {
            let userData = JSON.parse(await util.sendRequest("post", "/auth/login", {name, password}));
            this.game.setUserData(userData.id, userData.username);
            this.authCompleted();
        } catch (e) {
            this.uiController.uiElements.authUI.loginError(e);
        }
    }

    async register(name, email, password) {

    }
}

export {AuthViewState}
