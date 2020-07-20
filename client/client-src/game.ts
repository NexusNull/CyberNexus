import {UIController} from "./UI/UIController";
import {InputController} from "./UI/InputController";
import {AssetManager} from "./AssetManagement/AssetManager";

class Game {
    uiController: UIController;
    inputController: InputController;
    assetManager: AssetManager;

    constructor() {
        this.assetManager = new AssetManager();
        this.inputController = new InputController(this);
        this.uiController = new UIController(this, this.inputController);
    }

    main() {
        this.uiController.changeViewState(this.uiController.viewStates.loading)
    }
}

export {Game}

let game = new Game();
game.main();

