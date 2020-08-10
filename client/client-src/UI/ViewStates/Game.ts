import {ViewState} from "./ViewState";
import {Game} from "../../game";
import {UIController} from "../UIController";
import {InputController} from "../InputController";
import {GameScene} from "../../Game/rendering/GameScene";
import {GameState} from "../../Game/GameState";

class GameViewSate extends ViewState {
    gameState: GameState;

    constructor(game: Game, uiController: UIController, inputController: InputController) {
        super(game, uiController, inputController);

    };

    async disable(): Promise<any> {
        return undefined;
    }

    async enable(): Promise<any> {
        this.game.gameScene.clear();
        this.gameState = new GameState(this.game.gameScene);

    }

    async setup(): Promise<any> {

    }


}

export {GameViewSate};