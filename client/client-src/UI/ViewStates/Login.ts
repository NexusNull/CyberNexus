import {ViewState} from "./ViewState";
import {Game} from "../../game";
import {UIController} from "../UIController";
import {InputController} from "../InputController";

class LoginViewState extends ViewState {
    constructor(game: Game, uiController: UIController, inputController: InputController) {
        super(game, uiController, inputController);

    }

    async disable(): Promise<any> {
        this.uiController.uiElements.loginUI.hide();
    }

    async enable(): Promise<any> {
        this.uiController.uiElements.loginUI.display();
    }

    async setup(): Promise<any> {
        return undefined;
    }
}

export {LoginViewState}