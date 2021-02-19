import {GameScene} from '../rendering/GameScene';
import {
    AmbientLight,
    Material,
    Mesh,
    MeshLambertMaterial,
    PointLight,
    Vector3,
} from 'three';
import {Beam} from '../rendering/Beam';
import {Assets} from '../../AssetManagement/Assets';
import {ChunkRenderer} from '../rendering/ChunkRenderer';
import {Perlin} from "../../definitions/Perlin";


declare let perlin: Perlin;
declare let window: any;

export class TowerDefenceDemo {
    intervalID: number;
    materials: Array<Material>;
    meshes: Array<Mesh>;
    startTime: Date;
    chunks: Array<Mesh>;
    assets: Assets;
    gameScene: GameScene;
    onDone: () => void;

    constructor(assets: Assets, gameScene: GameScene, onDone: () => void) {
        this.assets = assets;
        this.gameScene = gameScene;
        this.onDone = onDone;

        this.chunks = [];
        const chunkRenderer = new ChunkRenderer(assets);
        const beam = new Beam(new Vector3(10, 18, 10), new Vector3(-10, 18, -10), 0.2, 0.5, assets.textures.get('uvTest'));
        window.beam = beam;
        gameScene.world.position.x = 20;
        gameScene.world.add(beam.mesh);
        const greenMat = new MeshLambertMaterial({color: 0x001b00});
        const pLight = new PointLight(0xffffff, 0.7, 200, 0.5);
        const aLight = new AmbientLight(0xffffff, 0.9);

        gameScene.world.add(pLight);
        gameScene.world.add(aLight);

        pLight.position.y = 50;

        for (let _x = -1; _x < 2; _x++) {
            for (let _z = -1; _z < 2; _z++) {
                const blockData = new Uint8Array(18 * 34 * 18);

                for (let y = 0; y < 32; y++) {
                    for (let z = 0; z < 16; z++) {
                        for (let x = 0; x < 16; x++) {
                            const i = (y + 1) * 612 + (z + 1) * 18 + x + 1;
                            blockData[i] = (perlin.simplex2((_x * 16 + x) * 0.06, (_z * 16 + z) * 0.06) + 1) * 8 > y ? 1 : 0;
                        }
                    }
                }

                const geometry = chunkRenderer.renderChunk(blockData);
                const chunk = new Mesh(geometry, greenMat);
                chunk.position.x = 16 * _x - 8;
                chunk.position.z = 16 * _z - 8;
                this.chunks.push(chunk);
                this.gameScene.world.add(chunk);
            }
        }


        this.gameScene.mainCamera.position.y = 40;
        this.gameScene.mainCamera.position.z = 35;

        this.gameScene.mainCamera.rotation.x = -Math.PI * 0.3;
        this.materials = [greenMat];
    }

    start() {
        this.startTime = new Date();
        this.intervalID = window.setInterval(() => {
            this.gameScene.world.rotation.y += 0.001;
            if (new Date().getTime() - this.startTime.getTime() > 20000000) {
                this.stop();
                this.onDone();
            }
        }, 16);
    }

    stop() {
        if (this.intervalID) {
            clearInterval(this.intervalID);
        }
        this.dispose();
    }

    dispose() {
        for (const chunk of this.chunks) {
            this.gameScene.world.remove(chunk);
            chunk.geometry.dispose();
        }
    }
}
