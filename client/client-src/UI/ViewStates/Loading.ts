import {AssetManager} from "../../AssetManagement/AssetManager";
import {ViewState} from "./ViewState";
import {Game} from "../../game";
import {UIController} from "../UIController";
import {InputController} from "../InputController";

class LoadingViewState extends ViewState {

    constructor(game: Game, uiController: UIController, inputController: InputController) {
        super(game, uiController, inputController);
    };


    async enable() {
        var self = this;
        this.uiController.uiElements.loadingUI.display();
        this.game.assetManager.on("error", function (data) {
            self.uiController.uiElements.loadingUI.setMessage(`Failed: ${data.message}`);
        });

        this.game.assetManager.on("progress", function (data) {
            self.uiController.uiElements.loadingUI.setMessage(data.message);
            self.uiController.uiElements.loadingUI.setProgress(data.percentage * 100)
        });

        this.game.assetManager.on("finished", function (data) {
            self.uiController.uiElements.loadingUI.setMessage(data.message);
            self.uiController.uiElements.loadingUI.setProgress(100);
            self.uiController.changeViewState(self.uiController.viewStates.auth);
        });

        this.game.assetManager.init();
        /*
        then(async function () {
            self.uiController.game.modelLoader = new ModelLoader(self.textureLoader.spriteAtlases.get("blocks"));
            self.uiController.game.modelLoader.init();
            let models = JSON.parse(await util.loadJSON("js/models.json"));
            for (let i = 0; i < models.length; i++) {
                self.uiController.game.modelLoader.loadModel(models[i]);
            }
        });
        */

    };


    async disable() {
        this.uiController.uiElements.loadingUI.hide();
    };

    async setup() {

    }



}

export {LoadingViewState}