/* eslint-disable */
import {ViewState} from './ViewState';
import {Game} from '../../Game';
import type {UIController} from '../UIController';
import type {InputController} from '../InputController';
import {FileSystemManager} from "../UIHelpers/FileSystemManager";
import type {Action} from "../../definitions/Action";

export class CodeEditorViewState extends ViewState {
    currentFile: string;
    actions: Action[];

    constructor(game: Game, uiController: UIController, inputController: InputController) {
        super(game, uiController, inputController);
        this.actions = [
            this.inputController.registerAction("Save File",
                {code: "KeyS", modifiers: {ctrlKey: true}},
                (event) => {

                }),
        ];
        this.currentFile = null;
    }

    async disable(): Promise<any> {
        this.uiController.uiElements.codeEditorUI.hide();
        for (let action of this.actions) {
            action.active = false;
        }
    }

    async enable(): Promise<any> {
        this.uiController.uiElements.codeEditorUI.display();
        this.uiController.uiElements.consoleUI.codeInput.refresh();
        this.uiController.uiElements.codeEditorUI.editor.refresh();
        for (let action of this.actions) {
            action.active = true;
        }
    }

    async setup(): Promise<any> {

    }

    async requestDirectoryStructure(path) {

    }

    async createDirectory(path) {

    }

    async createFile(path) {

    }

    startRunner() {

    }

    saveFile() {

    }
}
