import {GameScene} from '../rendering/GameScene';
import {TowerDefenceDemo} from './TowerDefenceDemo';
import {Assets} from '../../AssetManagement/Assets';


export class DemoManager {
    demos = Array<any>();
    activeDemo: any;
    isActive: boolean;
    assets: Assets;
    gameScene: GameScene;

    constructor(assets: Assets, gameScene: GameScene) {
        this.assets = assets;
        this.gameScene = gameScene;
        this.activeDemo = null;
        this.isActive = false;
        this.demos = [
            TowerDefenceDemo,
        ];
    }

    playRandomDemo() {
        if (this.isActive) {
            const i = Math.floor(this.demos.length * Math.random());
            const demo = new this.demos[i](this.assets, this.gameScene, this.playRandomDemo.bind(this));
            this.activeDemo = demo;
            demo.start();
        }
    }

    start() {
        this.isActive = true;
        this.playRandomDemo();
    }

    stop() {
        this.isActive = false;
        this.activeDemo.stop();
    }
}
