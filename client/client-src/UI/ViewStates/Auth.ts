import {ViewState} from './ViewState';
import {Game} from '../../Game';
import {UIController} from '../UIController';
import {InputController} from '../InputController';
import util from '../../util/Util';

class AuthViewState extends ViewState {
    constructor(game: Game, uiController: UIController, inputController: InputController) {
        super(game, uiController, inputController);
    }

    async disable(): Promise<any> {
        this.uiController.uiElements.authUI.hide();
    }

    async enable(): Promise<any> {
        try {
            const userData = JSON.parse(await util.sendRequest('GET', '/auth/self'));
            this.game.userData.setUsername(userData.username);
            this.game.userData.setId(userData.id);
            this.game.userData.setAuthStatus(true);
            this.authCompleted();
            return;
        } catch (e) {
            console.error(e);
        }

        this.uiController.uiElements.authUI.display();
    }

    authCompleted() {
        this.uiController.uiElements.authUI.clearForms();
        this.uiController.changeViewState(this.uiController.viewStates.serverBrowser);
    }

    async login(name, password) {
        try {
            const userData = JSON.parse(await util.sendRequest('post', '/auth/login', {name, password}));
            this.game.userData.setUsername(userData.username);
            this.game.userData.setId(userData.id);
            this.game.userData.setAuthStatus(true);
            this.authCompleted();
        } catch (e) {
            this.uiController.uiElements.authUI.loginError(e);
        }
    }

    async register(name, email, password) {
        //TODO implement after cleanup
        console.log("ADD ME");
    }
}

export {AuthViewState};
