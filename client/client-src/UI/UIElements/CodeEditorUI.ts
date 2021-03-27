import {UIController} from '../UIController';
import CodeMirror from 'codemirror';
import {FileUI} from './FileUI';
import {VariableSeparator} from '../UIHelpers/VariableSeparator';

export class CodeEditorUI {
    uiController: UIController;
    element: HTMLDivElement;
    visible: boolean;
    separators: Array<VariableSeparator>;
    editor: CodeMirror.Editor;
    editorElement: HTMLDivElement;
    consoleElement: HTMLDivElement;
    currentFile: FileUI;
    saveTimeout: number;

    constructor(uiController: UIController) {
        this.uiController = uiController;
        this.element = <HTMLDivElement>document.getElementById('CodeEditor');
        this.editorElement = <HTMLDivElement>document.getElementById('CECodeEditor');
        this.consoleElement = <HTMLDivElement>document.getElementById('CEConsole');
        this.currentFile = null;
        this.separators = [];

        const separators = <HTMLCollectionOf<HTMLDivElement>>this.element.getElementsByClassName('verticalSeparator');
        for (const separator of separators) {
            this.separators.push(new VariableSeparator(separator, <HTMLDivElement>separator.previousElementSibling));
        }

        this.editor = CodeMirror(this.editorElement, {
            lineNumbers: true,
            mode: 'javascript',
            value: '',
        });

        this.editor.on('change', () => {
            clearTimeout(this.saveTimeout);
            this.saveTimeout = window.setTimeout(async () => {
                await this.uiController.viewStates.codeEditor.saveFile();
            }, 5000);
        });
    }

    display(): void {
        this.element.classList.remove('hidden');
        this.visible = true;
        this.editor.refresh();
    }

    hide(): void {
        this.element.classList.add('hidden');
        this.visible = false;
    }
}
