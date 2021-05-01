import {Game} from '../../Game';
import {UIController} from '../UIController';
import {InputController} from '../InputController';

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

    //TODO This class has the issue that a common functionality is always implemented in sub classes
    // setup should be called once when enabled is called, this behaviour is implemented in all sub classes right now
    // this shouldn't be the case
    async setup(): Promise<void> {
        // do nothing
    }

    async enable(): Promise<void> {
        // do nothing
    }

    async disable(): Promise<void> {
        // do nothing
    }
}
