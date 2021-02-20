import {ViewState} from './ViewState';
import {Game} from '../../Game';
import {UIController} from '../UIController';
import {InputController} from '../InputController';
import util from '../../util/Util';

class AuthViewState extends ViewState {
    constructor(game: Game, uiController: UIController, inputController: InputController) {
        super(game, uiController, inputController);
    }

    async disable(): Promise<void> {
        this.uiController.uiElements.authUI.hide();
    }

    async enable(): Promise<void> {
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

    authCompleted(): void {
        this.uiController.uiElements.authUI.clearForms();
        this.uiController.changeViewState(this.uiController.viewStates.serverBrowser);
        this.game.updateToken();
    }

    async login(name: string, password: string): Promise<void> {
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

    async register(name: string, email: string, password: string): Promise<void> {
        //TODO implement after cleanup
        console.log("ADD ME");
    }
}

export {AuthViewState};
