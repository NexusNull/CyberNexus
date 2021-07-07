import {ViewState} from './ViewState';
import {Game} from '../../Game';
import type {UIController} from '../UIController';
import type {InputController} from '../InputController';
import type {Action} from "../../definitions/Action";

export class CodeEditorViewState implements ViewState {
    game: Game;
    isSetup: boolean;
    uiController: UIController;
    inputController: InputController;
    currentFile: string;
    actions: Action[];

    constructor(game: Game, uiController: UIController, inputController: InputController) {
        this.game = game;
        this.uiController = uiController;
        this.inputController = inputController;
        this.actions = [
            this.inputController.registerAction("Save File",
                {code: "KeyS", modifiers: {ctrlKey: true}}),
        ];
        this.currentFile = null;
    }

    async disable(): Promise<void> {
        this.uiController.uiElements.codeEditorUI.hide();
        for (const action of this.actions) {
            action.active = false;
        }
    }

    async enable(): Promise<void> {
        this.uiController.uiElements.codeEditorUI.display();
        this.uiController.uiElements.consoleUI.codeInput.refresh();
        this.uiController.uiElements.codeEditorUI.editor.refresh();
        for (const action of this.actions) {
            action.active = true;
        }
    }

    async saveFile(): Promise<void> {
        //TODO implement
    }

    startRunner(): void {
        //TODO implement
    }

    setup(): Promise<void> {
        this.isSetup = true;
        return Promise.resolve(undefined);
    }


}
