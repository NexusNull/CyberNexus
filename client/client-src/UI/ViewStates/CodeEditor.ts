/* eslint-disable */
import {ViewState} from './ViewState';
import {Game} from '../../Game';
import {UIController} from '../UIController';
import {InputController} from '../InputController';
import {FileUI} from '../UIElements/FileUI';
import {FileSystemManager} from "../UIHelpers/FileSystemManager";

export class CodeEditorViewState extends ViewState {
    currentFile: string;
    fileSystemManager: FileSystemManager

    constructor(game: Game, uiController: UIController, inputController: InputController) {
        super(game, uiController, inputController);

        this.fileSystemManager = new FileSystemManager(game, uiController, inputController, this);
        this.currentFile = null;
    }

    async disable(): Promise<any> {
        this.uiController.uiElements.codeEditorUI.hide();
    }

    async enable(): Promise<any> {
        this.uiController.uiElements.codeEditorUI.display();
        this.uiController.uiElements.consoleUI.codeInput.refresh();
        this.uiController.uiElements.codeEditorUI.editor.refresh();
    }

    async setup(): Promise<any> {

    }

    async requestDirectoryStructure(path) {

    }

    async openFile(path) {
        let a = await this.fileSystemManager.readFile(path);
        this.uiController.uiElements.codeEditorUI.editor.setValue(a);
        this.currentFile = path;
        console.log(a);
    }

    async saveFile() {
        if (this.currentFile) {
            await this.fileSystemManager.writeFile(this.currentFile, this.uiController.uiElements.codeEditorUI.editor.getValue());
        }
    }

    async createDirectory(path) {

    }

    async createFile(path) {

    }
}
