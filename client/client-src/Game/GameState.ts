/**
 * This class serves as the source of truth, once a server connection is established this class will get periodical updates that keep the client in sync with the server.
 *
 */

import {Chunk} from "./Chunk";
import {EventSystem} from "../util/EventSystem";
import {GameScene} from "./rendering/GameScene";

class GameState extends EventSystem {
    chunks: Map<string, Chunk>;

    constructor(gameScene: GameScene) {
        super();
        this.chunks = new Map();


    }

    updateChunk(chunkData) {


    }
}

export {GameState}