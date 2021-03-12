import {Game} from "../../Game";
import {UIController} from "../UIController";
import {InputController} from "../InputController";
import {CodeEditorViewState} from "../ViewStates/CodeEditor";
import {DirectoryUI} from "../UIElements/DirectoryUI";
import {FileUI} from "../UIElements/FileUI";
import * as BrowserFS from "browserfs";
import {FSModule} from "browserfs/dist/node/core/FS";
import WebDav from "browserfs/dist/node/backend/WebDav";
import util from "../../util/Util";


export class FileSystemManager {
    directoryStructure: HTMLDivElement;
    game: Game;
    uiController: UIController;
    inputController: InputController;
    codeEditor: CodeEditorViewState;
    fs: FSModule;
    rootDir: DirectoryUI;
    activeElements: Set<string>;
    updateQueue: (() => void)[];
    updateTimeout: number;
    activeElementsUpdateTimeout: number;

    constructor(game: Game, uiController: UIController, inputController: InputController, codeEditor: CodeEditorViewState) {
        this.game = game;
        this.uiController = uiController;
        this.inputController = inputController;
        this.codeEditor = codeEditor;
        this.directoryStructure = <HTMLDivElement>document.getElementById('CEDirectoryStructure');
        this.activeElements = new Set();
        this.rootDir = new DirectoryUI(this.uiController.uiElements.fileSystemUI, null, "/");
        this.rootDir.expand();
        this.uiController.uiElements.fileSystemUI.addRootElement(this.rootDir);
        this.updateQueue = [];
        this.updateTimeout = setInterval(() => {
            let func;
            try {
                func = this.updateQueue.shift();
                if (func)
                    func();
            } catch (e) {
                console.error("Error in update queue:" + e.stack);
                console.error(func);
            }
        }, 100);

        this.activeElementsUpdateTimeout = setInterval(() => {
            for (const path of this.activeElements) {
                this.update(path);
            }
        }, 5000);


        BrowserFS.configure({
            fs: 'WebDav',
            options: {
                prefixUrl: 'http://localhost:2000/fs/',
            },
        }, (e) => {
            if (e) {
                throw e;
            }
        });

        this.fs = BrowserFS.BFSRequire('fs');
        this.game.userData.on("tokenIssued", async (tokenContainer) => {
            if (tokenContainer.body.scope == "webdav") {
                const rootFS = this.fs.getRootFS();
                if (rootFS.getName() === "WebDav") {
                    const webDavFS = (rootFS as WebDav);
                    webDavFS.client.setHeaders({"Authorization": "Bearer " + tokenContainer.token});
                    const newActive = new Set();
                    for (const pathPerms of tokenContainer.body.paths) {
                        if (pathPerms.perms.includes("canRead")) {
                            newActive.add(pathPerms.path);
                        }
                    }
                    const toActivate = util.differenceSet(newActive, this.activeElements);
                    const toDeactivate = util.differenceSet(this.activeElements, newActive);
                    for (const path of toActivate) {
                        await this.addActive(path);
                    }
                    for (const path of toDeactivate) {
                        this.removeActive(path);
                    }
                }
            }
        });
    }

    async update(path) {
        return new Promise((resolve, reject) => {
            this.updateQueue.push(() => {
                const fsElement = this.getElement(path);
                if (fsElement instanceof DirectoryUI) {
                    this.fs.readdir(path, (err, names) => {
                        if (err)
                            reject(err);
                        for (const name of names) {
                            this.update(fsElement.getPath() + "/" + name);
                        }
                    });
                } else if (fsElement instanceof FileUI) {
                    console.log("file:" + path);
                } else {
                    const parsedPath = util.parsePath(path);
                    const parent = this.getElement("/" + parsedPath.slice(0, -1).join("/"));
                    this.fs.stat(path, (err, stats) => {
                        if (stats.isFile()) {
                            new FileUI(this.uiController.uiElements.fileSystemUI, parent, parsedPath[parsedPath.length - 1]);
                        } else if (stats.isDirectory()) {
                            new DirectoryUI(this.uiController.uiElements.fileSystemUI, parent, parsedPath[parsedPath.length - 1]);
                        }
                    });
                }
            });
        });
    }

    getElement(path: string): DirectoryUI | FileUI {
        const parsedPath = util.parsePath(path);
        let current = this.rootDir;
        for (let i = 0; i < parsedPath.length - 1; i++) {
            const dir: DirectoryUI = <DirectoryUI>current.getChild(parsedPath[i]);
            if (!dir) {
                return null;
            }
            current = dir;
        }
        return current.getChild(parsedPath[parsedPath.length - 1]);

    }

    /** Not all folders are owned by the user, we only activate those that we actually have access to
     *  Activated Directories are directories we are allowed to read
     */
    async addActive(path: string): Promise<void> {
        const parsedPath = util.parsePath(path);
        let current = this.rootDir;
        for (let i = 0; i < parsedPath.length - 1; i++) {
            let dir: DirectoryUI = <DirectoryUI>current.getChild(parsedPath[i]);
            if (!dir) {
                dir = new DirectoryUI(this.uiController.uiElements.fileSystemUI, current, parsedPath[i]);
                dir.expand();
            }
            current = dir;
        }
        //last element in the path can be directory or File
        this.fs.stat(path, (err, stats) => {
            if (stats.isDirectory()) {
                const dir = new DirectoryUI(this.uiController.uiElements.fileSystemUI, current, parsedPath[parsedPath.length - 1]);
                dir.expand();
                this.activeElements.add(path);
            } else if (stats.isFile()) {
                new FileUI(this.uiController.uiElements.fileSystemUI, current, parsedPath[parsedPath.length - 1]);
                this.activeElements.add(path);
            }
        });
    }

    removeActive(name: string): void {
        //do nothing
    }
}