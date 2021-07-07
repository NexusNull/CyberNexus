import {ViewState} from './ViewState';
import {Game} from '../../Game';
import {UIController} from '../UIController';
import {InputController} from '../InputController';
import {GameState} from '../../Game/GameState';

export class GameViewSate implements ViewState {
    isSetup: boolean;
    game: Game;
    uiController: UIController;
    inputController: InputController;
    gameState: GameState;

    constructor(game: Game, uiController: UIController, inputController: InputController) {
        this.game = game;
        this.uiController = uiController;
        this.inputController = inputController;
    }

    async disable(): Promise<void> {
        return;
    }

    async enable(): Promise<void> {
        this.game.gameScene.clear();
        this.gameState = new GameState(this.game.gameScene);
    }

    async setup(): Promise<void> {
        this.isSetup = true;
        return;
    }

}
