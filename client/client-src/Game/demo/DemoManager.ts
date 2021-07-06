import {GameScene} from '../rendering/GameScene';
import {TowerDefenceDemo} from './TowerDefenceDemo';
import {Assets} from '../../AssetManagement/Assets';
import {Demo} from "./Demo";


export class DemoManager {
    demos = Array<Demo>();
    activeDemo: Demo;
    isActive: boolean;
    assets: Assets;
    gameScene: GameScene;

    constructor(assets: Assets, gameScene: GameScene) {
        this.assets = assets;
        this.gameScene = gameScene;
        this.activeDemo = null;
        this.isActive = false;
        this.demos = [
            new TowerDefenceDemo(this.assets, this.gameScene, this.playRandomDemo.bind(this)),
        ];
    }

    playRandomDemo(): void {
        if (this.isActive) {
            const i = Math.floor(this.demos.length * Math.random());
            const demo = this.demos[i];
            demo.init();
            this.activeDemo = demo;
            demo.start();
        }
    }

    start(): void {
        this.isActive = true;
        this.playRandomDemo();
    }

    stop(): void {
        this.isActive = false;
        this.activeDemo.stop();
    }
}
