/* eslint-disable */
import {ViewState} from './ViewState';
import {Game} from '../../Game';
import {UIController} from '../UIController';
import {InputController} from '../InputController';
import {FileUI} from '../UIElements/FileUI';

export class CodeEditorViewState extends ViewState {
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
        this.uiController.uiElements.consoleUI.codeInput.refresh();
        this.uiController.uiElements.codeEditorUI.editor.refresh();
    }

    async setup(): Promise<any> {

    }

    async requestDirectoryStructure(path) {

    }

    async openFile(fileUI) {

    }

    async saveFile(content) {

    }

    async createDirectory(path) {

    }

    async createFile(path) {

    }
}
