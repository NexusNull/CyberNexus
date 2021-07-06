import {Game} from "../../Game";
import util from "../../util/Util";
import {FileStat, WebDAVClient} from "webdav/dist/node/types";
import {createClient} from "webdav/web";
import {EventSystem} from "../../util/EventSystem";


interface Directory {
    filename: string,
    basename: string,
    lastmod: string,
    size: number,
    type: "directory",
    children: Map<string, Directory | File>
    fake?: boolean,
}

interface File {
    filename: string,
    basename: string,
    lastmod: string,
    size: number,
    type: "file",
    fake?: boolean
}

type FsElement = Directory | File;

export class FileSystemManager extends EventSystem {
    game: Game;
    webdav: WebDAVClient;
    // the root elements the user has access to
    activeElements: Set<string>;
    fs: Map<string, FsElement>;

    constructor(game: Game) {
        super();
        this.game = game;
        this.activeElements = new Set();
        this.webdav = createClient("//localhost:2000/fs/");
        this.fs = new Map();

        this.game.userData.on("tokenIssued", async (tokenContainer) => {
            if (tokenContainer.body.scope == "webdav") {
                this.webdav.setHeaders({"Authorization": "Bearer " + tokenContainer.token});
                const newActive = new Set<string>();
                for (const pathPerms of tokenContainer.body.paths) {
                    if (pathPerms.perms.includes("canRead")) {
                        newActive.add(pathPerms.path);
                    }
                }
                /*
                    to facilitate access to multiple directories on the root level things are kept as general as possible
                    in the future adding documentation to everyone's project is so very easy
                 */
                const toActivate = util.differenceSet<string>(newActive, this.activeElements);
                const toDeactivate = util.differenceSet<string>(this.activeElements, newActive);
                for (const path of toActivate) {
                    this._createFakeDir(path);
                    await this.addActive(path);
                }
                for (const path of toDeactivate) {
                    this.removeActive(path);
                }
                this.fullDir(this.activeElements.keys().next().value);
                setTimeout(() => {
                    this.fullDir(this.activeElements.keys().next().value);
                }, 1000);
            }
        });
    }

    private async addActive(path: string) {
        this.activeElements.add(path);
    }

    private removeActive(path: string) {
        this.activeElements.delete(path);
    }

    async fullDir(path: string): Promise<void> {
        if (!path.endsWith("/"))
            throw new Error("Path has to end with a /");

        const tmpFs = <FileStat[]>await this.webdav.getDirectoryContents(path, {deep: true});
        const fsMap: Map<string, FileStat> = new Map(); // this Map gives quick access to the data behind a new entry
        const serverFs: Set<string> = new Set(); // this Set is to quickly calculate which files to create and which to delete
        for (const element of tmpFs) {
            serverFs.add(element.filename);
            fsMap.set(element.filename, element);
        }

        let localFs;
        {
            let files = Array.from(this.fs.keys());
            files = files.filter((a) => {
                return a.startsWith(path);
            });
            localFs = new Set(files);
        }

        const toActivate = util.differenceSet(serverFs, localFs);
        const toDeactivate = util.differenceSet(localFs, serverFs);
        for (const path of toActivate) {
            const element = fsMap.get(path);
            if (element.type === "directory") {
                this._createDir(path, element);
            } else {
                this._createFile(path, element);
            }
        }

        for (const path of toDeactivate) {
            await this.emit("deleted", this.fs.get(path));
            this.fs.delete(path);
        }
    }

    async fullFetch(): Promise<void> {
        for (const path of this.activeElements) {
            await this.fullDir(path);
        }
    }

    /**
     * This function creates fake directories for the entire path
     * @param path
     * @private
     */
    private _createFakeDir(path) {
        const parsedPath = util.parsePath(path);
        let currentPath = "";
        for (const dirName of parsedPath) {
            currentPath += "/" + dirName;
            const dir = {
                filename: currentPath,
                basename: dirName,
                lastmod: "Thu Jan 01 1970 00:00:00 GMT+0000",
                size: 0,
                type: "directory",
                children: new Map(),
                fake: true
            };
            this.emit("created", Object.assign({}, dir));
            this.fs.set(currentPath, <Directory>dir);
        }
    }

    private _createDir(path, data) {
        const parentPath = "/" + util.parsePath(path).slice(0, -1).join("/");
        const parent = this.fs.get(parentPath);
        if (!parent)
            throw new Error("Missing Parent " + parentPath);
        if (parent.type !== "directory")
            throw new Error("Parent isn't a directory");

        parent.children.set(data.basename, {
            filename: data.filename,
            basename: data.basename,
            lastmod: "0",
            size: 0,
            type: "directory",
            children: new Map(),
            fake: false,
        });
        data.children = new Map();
        this.fs.set(path, data);

        this.emit("created", Object.assign({}, data));
    }

    private _createFile(path, data) {
        const parentPath = "/" + util.parsePath(path).slice(0, -1).join("/");
        const parent = this.fs.get(parentPath);
        if (!parent)
            throw new Error("Missing Parent " + parentPath);
        if (parent.type !== "directory")
            throw new Error("Parent isn't a directory");

        parent.children.set(data.basename, {
            filename: data.filename,
            basename: data.basename,
            lastmod: "0",
            size: 0,
            type: "directory",
            children: new Map(),
            fake: false,
        });
        data.children = new Map();
        this.fs.set(path, data);

        this.emit("created", Object.assign({}, data));
    }
}