import {Game} from "../../Game";
import {UIController} from "../UIController";
import {InputController} from "../InputController";
import {CodeEditorViewState} from "../ViewStates/CodeEditor";
import {DirectoryUI} from "../UIElements/DirectoryUI";
import * as BrowserFS from "browserfs";
import {FSModule} from "browserfs/dist/node/core/FS";
import WebDav from "browserfs/dist/node/backend/WebDav";

export class FileSystemManager {
    directoryStructure: HTMLDivElement;
    game: Game;
    uiController: UIController;
    inputController: InputController;
    codeEditor: CodeEditorViewState;
    fs: FSModule;

    constructor(game: Game, uiController: UIController, inputController: InputController, codeEditor: CodeEditorViewState) {
        this.game = game;
        this.uiController = uiController;
        this.inputController = inputController;
        this.codeEditor = codeEditor;
        this.directoryStructure = <HTMLDivElement>document.getElementById('CEDirectoryStructure');

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
        this.game.userData.on("tokenIssued", (tokenContainer) => {
            if (tokenContainer.body.scope == "webdav") {
                const rootFS = this.fs.getRootFS();
                if (rootFS.getName() === "WebDav") {
                    const webDavFS = (rootFS as WebDav);
                    webDavFS.client.setHeaders({"Authorization": "Bearer " + tokenContainer.token});
                }
            }
        });
    }

    updateFileSystem() {
        //do nothing
    }

    /** Not all folders are owned by the user, we only activate those that we actually have access to */
    addActivateDir(name: string): void {
        const dir = new DirectoryUI(this.uiController.uiElements.fileSystemUI, null, name);
        this.uiController.uiElements.fileSystemUI.addRootDir(dir);
    }

    removeActiveDir(name: string): void {
        //do nothing
    }

    async fullFetch() {
        //do nothing

    }


}