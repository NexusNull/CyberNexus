import {ViewState} from './ViewState';
import {Game} from '../../Game';
import {UIController} from '../UIController';
import {InputController} from '../InputController';
import {GameState} from '../../Game/GameState';

export class GameViewSate extends ViewState {
    gameState: GameState;

    constructor(game: Game, uiController: UIController, inputController: InputController) {
        super(game, uiController, inputController);
    }

    async disable(): Promise<void> {
        return;
    }

    async enable(): Promise<void> {
        this.game.gameScene.clear();
        this.gameState = new GameState(this.game.gameScene);
    }

}
