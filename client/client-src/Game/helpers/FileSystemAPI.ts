import {util} from "../../util/Util";

class FileSystemAPI {
    constructor() {

    }

    async createDirectory(path) {
        return await util.sendRequest("POST", "/fs/" + path);
    }

    async writeFile(path, content) {
        return await util.sendRequest("POST", "/fs/" + path, content);
    }

    async listDirectory(path): Promise<Array<{ path: string, type: string }>> {
        return <Array<{ path: string, type: string }>>JSON.parse(await util.sendRequest("GET", "/fs/" + path));
    }

    async getFile(path) {
        return await util.sendRequest("GET", "/fs/" + path);
    }

    async deleteFile(path) {
        return await util.sendRequest("DELETE", "/fs/" + path);
    }

    async deleteDirectory(path) {
        return await util.sendRequest("DELETE", "/fs/" + path);
    }

    validateDirectoryName(name) {
        return /^[0-9a-zA-Z_\-]{0,32}$/.test(name);
    }

    validateFileName(name) {
        return /^[0-9a-zA-Z_\-]{0,32}\.[0-9a-zA-Z_\-]{1,32}$/.test(name);
    }
}

let fileSystem = new FileSystemAPI();
export {fileSystem}