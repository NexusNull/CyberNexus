import {UIController} from "./UI/UIController";
import {InputController} from "./UI/InputController";
import {AssetManager} from "./AssetManagement/AssetManager";
import {Assets} from "./AssetManagement/Assets";
import {GameScene} from "./Game/rendering/GameScene";
import {DemoManager} from "./Game/demo/DemoManager";
import {ChunkRenderer} from "./Game/rendering/ChunkRenderer";
import {Runner} from "./Game/Runner";
import * as BrowserFS from "browserfs";

class Game {
    uiController: UIController;
    inputController: InputController;
    assetManager: AssetManager;
    assets: Assets;
    gameScene: GameScene;
    demoManager: DemoManager;
    chunkRenderer: ChunkRenderer;
    runner: Runner;
    userData: {
        username: string,
        id: number,
        jwt: string,
    } | null;

    constructor() {
        this.assets = new Assets();
        this.chunkRenderer = new ChunkRenderer(this.assets);
        this.assetManager = new AssetManager(this.assets);
        this.inputController = new InputController(this);
        this.uiController = new UIController(this, this.inputController);
        this.gameScene = new GameScene(this.uiController.uiElements.renderUI.canvas);
        this.demoManager = new DemoManager(this.assets, this.gameScene);
        this.runner = new Runner(this);
        this.userData = null;
        BrowserFS.install(window);
        BrowserFS.configure({
            fs: "WebDav",
            options: {
                prefixUrl: "http://localhost:2000/fs/"
            },
        }, function (e) {
            if (e) {
                // An error happened!
                throw e;
            }
        });
        window.fs = BrowserFS.BFSRequire("fs");
    }

    main() {
        this.uiController.changeViewState(this.uiController.viewStates.loading);
    }

    setUserData(id, username) {
        // @ts-ignore
        this.userData = this.userData || {};
        this.userData.id = id;
        this.userData.username = username;
    }

    setJwt(jwt: string) {
        this.userData.jwt = jwt;
    }
}

export {Game}
declare let window: any;
let game = new Game();
window.game = game;
game.main();

