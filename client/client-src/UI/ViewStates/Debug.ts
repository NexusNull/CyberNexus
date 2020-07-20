import {ViewState} from "./ViewState";
import {Game} from "../../game";
import {UIController} from "../UIController";
import {InputController} from "../InputController";

class DebugViewState extends ViewState {
    constructor(game: Game, uiController: UIController, inputController: InputController) {
        super(game, uiController, inputController);
    }

    async disable(): Promise<any> {

    }

    async enable(): Promise<any> {

    }

    async setup(): Promise<any> {

    }
}

export {DebugViewState}