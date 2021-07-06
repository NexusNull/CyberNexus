import {EventSystem} from '../util/EventSystem';
import {ChunkData} from '../definitions/ChunkData';

export class Chunk extends EventSystem {
    blockData: Uint8Array;
    position: Position;

    constructor(blockData: Uint8Array, position: Position) {
        super();
        this.blockData = blockData;
        this.position = position;
    }

    async update(chunkData: ChunkData): Promise<void> {
        this.blockData = chunkData.blockData;
        this.emit('chunkUpdate', {target: this, old: this.blockData, new: chunkData.blockData});
    }
}

