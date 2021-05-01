function posMod(num, mod) {
    let val = num % mod;
    return val >= 0 ? val : val + mod;
}


class BlockGeometry {
    constructor() {
        this.vertices = [];
        this.normals = [];
        this.uvs = [];
        //indexed
        this.sides = {
            north: [],
            east: [],
            south: [],
            west: [],
            up: [],
            down: [],
            free: [],
        };
        this.textures = [];
    }

    clone(data) {
        this.vertices = data.vertices.slice();
        this.normals = data.normals.slice();
        this.uvs = data.uvs.slice();
        this.sides = {
            north: data.sides.north.slice(),
            east: data.sides.east.slice(),
            south: data.sides.south.slice(),
            west: data.sides.west.slice(),
            up: data.sides.up.slice(),
            down: data.sides.down.slice(),
            free: data.sides.free.slice(),
        };
        this.textures = data.textures.slice();
        return this;
    }

    rotate(dir) {
        let theta = -dir * Math.PI / 2;

        //rotation Matrix for rotation around the y axis
        let rotMat = [
            -Math.sin(theta), Math.cos(theta),
            Math.cos(theta), Math.sin(theta),
        ];
        let verts = this.vertices;
        let norms = this.normals;

        for (let i = 0; i < verts.length / 3; i++) {
            verts[i * 3] = verts[i * 3] * rotMat[0] + verts[i * 3] * rotMat[2];
            verts[i * 3 + 2] = verts[i * 3 + 2] * rotMat[1] + verts[i * 3 + 2] * rotMat[3];

            norms[i * 3] = norms[i * 3] * rotMat[0] + norms[i * 3] * rotMat[2];
            norms[i * 3 + 2] = norms[i * 3 + 2] * rotMat[1] + norms[i * 3 + 2] * rotMat[3];
        }
        //rotate sides
        let oldSides = [
            this.sides.north,
            this.sides.east,
            this.sides.south,
            this.sides.west,
        ];

        this.sides.north = oldSides[posMod(0 + dir, 4)];
        this.sides.east = oldSides[posMod(1 + dir, 4)];
        this.sides.south = oldSides[posMod(2 + dir, 4)];
        this.sides.west = oldSides[posMod(3 + dir, 4)];


    }

    export() {

    }
}

module.exports = BlockGeometry;