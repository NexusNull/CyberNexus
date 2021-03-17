import {Game} from "../../Game";
import {UIController} from "../UIController";
import {InputController} from "../InputController";
import {CodeEditorViewState} from "../ViewStates/CodeEditor";
import {DirectoryUI} from "../UIElements/DirectoryUI";
import {FileUI} from "../UIElements/FileUI";
import util from "../../util/Util";
import {FileStat, WebDAVClient} from "webdav/dist/node/types";

import {createClient} from "webdav/web";

export class FileSystemManager {
    directoryStructure: HTMLDivElement;
    game: Game;
    uiController: UIController;
    inputController: InputController;
    codeEditor: CodeEditorViewState;
    webdav: WebDAVClient;
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
        this.webdav = createClient("//localhost:2000/fs/");
        this.rootDir = new DirectoryUI(this.uiController.uiElements.fileSystemUI, null, "/");
        this.rootDir.expand();
        this.uiController.uiElements.fileSystemUI.addRootElement(this.rootDir);
        this.updateQueue = [];
        this.updateTimeout = window.setInterval(() => {
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

        this.activeElementsUpdateTimeout = window.setInterval(() => {
            for (const path of this.activeElements) {
                this.update(path);
            }
        }, 5000);

        this.game.userData.on("tokenIssued", async (tokenContainer) => {
            if (tokenContainer.body.scope == "webdav") {
                this.webdav.setHeaders({"Authorization": "Bearer " + tokenContainer.token});
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
        });
    }

    async update(path) {
        return new Promise((resolve, reject) => {
            resolve();
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
        const stats: FileStat = <FileStat>await this.webdav.stat(path);
        if (stats.type === "directory") {
            const dir = new DirectoryUI(this.uiController.uiElements.fileSystemUI, current, parsedPath[parsedPath.length - 1]);
            dir.expand();
            this.activeElements.add(path);
        } else if (stats.type === "file") {
            new FileUI(this.uiController.uiElements.fileSystemUI, current, parsedPath[parsedPath.length - 1]);
            this.activeElements.add(path);
        }
    }

    removeActive(name: string): void {
        //do nothing
    }
}