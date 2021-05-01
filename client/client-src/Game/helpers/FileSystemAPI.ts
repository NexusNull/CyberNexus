/* eslint-disable */ //TODO This class needs to be redone after the cleanup has been finished
export class FileSystemAPI {
    constructor() {

    }

    async createDirectory() {

    }

    async writeFile() {

    }

    async listDirectory(): Promise<Array<{ path: string, type: string }>> {
        return [{path: '', type: ''}];
    }

    async getFile() {

    }

    async deleteFile() {

    }

    async deleteDirectory() {

    }

    validateDirectoryName() {

    }

    validateFileName() {

    }
}

const fileSystem = new FileSystemAPI();
export {fileSystem};
