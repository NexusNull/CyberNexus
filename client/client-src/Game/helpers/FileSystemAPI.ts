import util from "../../util/Util";

class FileSystemAPI {
    constructor() {

    }

    async createDirectory(path) {

    }

    async writeFile(path, content) {

    }

    async listDirectory(path): Promise<Array<{ path: string, type: string }>> {
        return [{path: "", type: ""}]
    }

    async getFile(path) {

    }

    async deleteFile(path) {
    }

    async deleteDirectory(path) {
    }

    validateDirectoryName(name) {
    }

    validateFileName(name) {
    }
}

let fileSystem = new FileSystemAPI();
export {fileSystem}