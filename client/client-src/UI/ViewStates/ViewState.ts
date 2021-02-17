import {Game} from "../../Game";
import {UIController} from "../UIController";
import {InputController} from "../InputController";

export abstract class ViewState {
    game: Game;
    uiController: UIController;
    inputController: InputController;
    isSetup: boolean;

    protected constructor(game: Game, uiController: UIController, inputController: InputController) {
        this.game = game;
        this.uiController = uiController;
        this.inputController = inputController;
    }

    abstract async setup();

    abstract async enable();

    abstract async disable();

}