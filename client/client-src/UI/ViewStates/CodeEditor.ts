import {ViewState} from "./ViewState";
import {Game} from "../../game";
import {UIController} from "../UIController";
import {InputController} from "../InputController";

class CodeEditorViewState extends ViewState {
    constructor(game: Game, uiController: UIController, inputController: InputController) {
        super(game, uiController, inputController);


    }

    async disable(): Promise<any> {
        this.uiController.uiElements.codeEditorUI.hide();
    }

    async enable(): Promise<any> {
        this.uiController.uiElements.codeEditorUI.display();
    }

    async setup(): Promise<any> {

    }
}

export {CodeEditorViewState}