import {UIController} from "./UI/UIController";
import {InputController} from "./UI/InputController";
import {AssetManager} from "./AssetManagement/AssetManager";
import {Assets} from "./AssetManagement/Assets";

class Game {
    uiController: UIController;
    inputController: InputController;
    assetManager: AssetManager;
    assets: Assets;

    constructor() {
        this.assets = new Assets();
        this.assetManager = new AssetManager(this.assets);
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

