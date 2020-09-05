import {ViewState} from "./ViewState";
import {Game} from "../../game";
import {UIController} from "../UIController";
import {InputController} from "../InputController";
import {fileSystem} from "../../Game/helpers/FileSystemAPI";
import {DirectoryUI} from "../UIElements/DirectoryUI";
import {FileSystemUI} from "../UIElements/FileSystemUI";

class CodeEditorViewState extends ViewState {

    constructor(game: Game, uiController: UIController, inputController: InputController) {
        super(game, uiController, inputController);
    }

    async disable(): Promise<any> {
        this.uiController.uiElements.codeEditorUI.hide();
    }

    async enable(): Promise<any> {
        this.uiController.uiElements.codeEditorUI.display();
    }

    async setup(): Promise<any> {
        this.requestDirectoryStructure("/");
    }

    async requestDirectoryStructure(path) {
        let fileSystemUI = this.uiController.uiElements.fileSystemUI;
        let directoryQueue = ["/"];

        while (directoryQueue.length > 0) {
            let path = directoryQueue.pop();
            let dir = await fileSystem.listDirectory(path);

            for (let element of dir) {
                if (element.type === "dir") {
                    fileSystemUI.addDirectory(element.path);
                    directoryQueue.push(element.path);
                } else {
                    fileSystemUI.addFile(element.path)
                }
            }
        }
    }

}

export {CodeEditorViewState}