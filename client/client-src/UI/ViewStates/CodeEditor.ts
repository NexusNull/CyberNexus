import {ViewState} from "./ViewState";
import {Game} from "../../game";
import {UIController} from "../UIController";
import {InputController} from "../InputController";
import {fileSystem} from "../../Game/helpers/FileSystemAPI";
import {FileUI} from "../UIElements/FileUI";

class CodeEditorViewState extends ViewState {
    currentFile: FileUI;

    constructor(game: Game, uiController: UIController, inputController: InputController) {
        super(game, uiController, inputController);
        this.currentFile = null;

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

    async openFile(fileUI) {
        if (this.currentFile)
            this.currentFile.unselect();

        this.currentFile = fileUI;
        this.currentFile.select();
        let path = this.currentFile.getPath();
        let data = await fileSystem.getFile(path);
        this.uiController.uiElements.codeEditorUI.editor.setValue(data);
    }

    async saveFile(content) {
        let path = this.currentFile.getPath();
        await fileSystem.writeFile(path, content);
    }

    async createDirectory(path) {
        await fileSystem.createDirectory(path);
    }

    async createFile(path) {
        await fileSystem.writeFile(path, "");
    }
}

export {CodeEditorViewState}