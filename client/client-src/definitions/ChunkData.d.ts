export interface ChunkData {
    position: {
        x: number,
        y: number,
        z: number,
    }
    blockData: Uint8Array;
}
