import {GameScene} from "../rendering/GameScene";
import {AmbientLight, BoxGeometry, Material, Mesh, MeshBasicMaterial, MeshLambertMaterial, PointLight} from "three";
import {Chunk} from "../Chunk";
import {Assets} from "../../AssetManagement/Assets";
import {ChunkRenderer} from "../rendering/ChunkRenderer";

declare let perlin: perlin;

class TowerDefenceDemo {
    intervalID: number;
    materials: Array<Material>;
    meshes: Array<Mesh>;
    startTime: Date;
    chunks: Array<Mesh>

    constructor(public assets: Assets, public gameScene: GameScene, public onDone: () => void) {
        this.chunks = [];
        let chunkRenderer = new ChunkRenderer(assets);

        let blueMat = new MeshLambertMaterial({color: 0x001b00});
        let pLight = new PointLight(0xffffff, 0.7, 200, 0.1);
        let aLight = new AmbientLight(0xffffff, 0.2);

        gameScene.world.add(pLight);
        gameScene.world.add(aLight);

        pLight.position.y = 50;

        for (let _x = -1; _x < 2; _x++) {
            for (let _z = -1; _z < 2; _z++) {
                let blockData = new Uint8Array(18 * 34 * 18);

                for (let y = 0; y < 32; y++) {
                    for (let z = 0; z < 16; z++) {
                        for (let x = 0; x < 16; x++) {
                            let i = (y + 1) * 612 + (z + 1) * 18 + x + 1;
                            blockData[i] = (perlin.simplex2((_x * 16 + x) * 0.06, (_z * 16 + z) * 0.06) + 1) * 8 > y ? 1 : 0;
                        }
                    }
                }

                let geometry = chunkRenderer.renderChunk(blockData, null);
                let chunk = new Mesh(geometry, blueMat);
                chunk.position.x = 16 * _x - 8;
                chunk.position.z = 16 * _z - 8;
                this.chunks.push(chunk);
                this.gameScene.world.add(chunk);
            }
        }


        this.gameScene.mainCamera.position.y = 40;
        this.gameScene.mainCamera.position.z = 35;

        this.gameScene.mainCamera.rotation.x = -Math.PI * 0.3;
        this.materials = [blueMat];
    }

    start() {

        this.startTime = new Date();
        this.intervalID = setInterval(() => {
            this.gameScene.world.rotation.y += 0.01
            if (new Date().getTime() - this.startTime.getTime() > 20000) {
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
        for (let chunk of this.chunks) {
            this.gameScene.world.remove(chunk);
            chunk.geometry.dispose();
        }
    }
}

export {TowerDefenceDemo};