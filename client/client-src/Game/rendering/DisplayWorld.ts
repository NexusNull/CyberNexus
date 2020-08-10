import {Mesh} from "three";

/**
 * This class manages the which chunks are visible to the user.
 * TODO this class should optimize the chunk meshes into a bigger mesh to reduce the number of draw calls
 */
class DisplayWorld {
    chunks = new Map<string, Mesh>();

    constructor() {

    }

}

export {DisplayWorld}