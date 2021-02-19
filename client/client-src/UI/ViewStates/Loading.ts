import {ViewState} from './ViewState';
import {Game} from '../../Game';
import {UIController} from '../UIController';
import {InputController} from '../InputController';

export class LoadingViewState extends ViewState {
    constructor(game: Game, uiController: UIController, inputController: InputController) {
        super(game, uiController, inputController);
    }


    async enable(): Promise<void> {
        this.uiController.uiElements.loadingUI.display();
        this.game.assetManager.on('error', (data) => {
            this.uiController.uiElements.loadingUI.setMessage(`Failed: ${data.message}`);
        });

        this.game.assetManager.on('progress', (data) => {
            this.uiController.uiElements.loadingUI.setMessage(data.message);
            this.uiController.uiElements.loadingUI.setProgress(data.percentage * 100);
        });

        this.game.assetManager.on('finished', (data) => {
            this.uiController.uiElements.loadingUI.setMessage(data.message);
            this.uiController.uiElements.loadingUI.setProgress(100);
            this.game.demoManager.start();
            this.game.gameScene.startRender();
            this.uiController.changeViewState(this.uiController.viewStates.auth);
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
    }


    async disable(): Promise<void> {
        this.uiController.uiElements.loadingUI.hide();
    }

}
