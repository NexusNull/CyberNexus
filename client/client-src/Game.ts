import {UIController} from './UI/UIController';
import {InputController} from './UI/InputController';
import {AssetManager} from './AssetManagement/AssetManager';
import {Assets} from './AssetManagement/Assets';
import {GameScene} from './Game/rendering/GameScene';
import {DemoManager} from './Game/demo/DemoManager';
import {ChunkRenderer} from './Game/rendering/ChunkRenderer';
import {Runner} from './Game/Runner';
import {UserData} from "./Game/UserData";

export class Game {
    uiController: UIController;
    inputController: InputController;
    assetManager: AssetManager;
    assets: Assets;
    gameScene: GameScene;
    demoManager: DemoManager;
    chunkRenderer: ChunkRenderer;
    runner: Runner;
    userData: UserData;


    constructor() {
        this.assets = new Assets();
        this.userData = new UserData(this);
        this.chunkRenderer = new ChunkRenderer(this.assets);
        this.assetManager = new AssetManager(this.assets);
        this.inputController = new InputController(this);
        this.uiController = new UIController(this, this.inputController);
        this.gameScene = new GameScene(this.uiController.uiElements.renderUI.canvas);
        this.demoManager = new DemoManager(this.assets, this.gameScene);
        this.runner = new Runner(this);

    }

    main(): void {
        this.uiController.changeViewState(this.uiController.viewStates.loading);
    }

}

declare let window: any;
const game = new Game();
window.game = game;
game.main();

