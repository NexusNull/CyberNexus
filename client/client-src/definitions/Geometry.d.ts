interface Geometry {
    vertices: Array<number>;
    normals: Array<number>;
    uvs: Array<number>;
    sides: {
        north: [number, number]
        east: [number, number]
        south: [number, number]
        west: [number, number]
        up: [number, number]
        down: [number, number]
        free: [number, number]
    }
    textures: Array<string>
    name: string
}