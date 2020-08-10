import {EventSystem} from "../util/EventSystem";
import {Mesh} from "three";

class Chunk extends EventSystem {
    blockData: Uint8Array;
    mesh: Mesh;
    position: { x: number, y: number, z: number };

    constructor(blockData, position) {
        super();
        this.blockData = blockData;
        this.position = position;
    }

    async update(chunkData: ChunkData) {
        this.blockData = chunkData.blockData;
        this.emit("chunkUpdate", {target: this, old: this.blockData, new: chunkData.blockData})
    }

}

export {Chunk}