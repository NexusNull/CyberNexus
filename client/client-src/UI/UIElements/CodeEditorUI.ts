import {UIController} from "../UIController";
import CodeMirror from 'codemirror';
import {FileUI} from "./FileUI";
import {VariableSeparator} from "../UIHelpers/VariableSeparator";
import Timeout = NodeJS.Timeout;

class CodeEditorUI {
    uiController: UIController;
    element: HTMLDivElement;
    visible: boolean;
    separators: Array<VariableSeparator>;
    editor: CodeMirror.Editor;
    editorElement: HTMLDivElement;
    consoleElement: HTMLDivElement;
    directoryStructure: HTMLDivElement;
    currentFile: FileUI;
    saveTimeout: Timeout;

    constructor(uiController: UIController) {
        this.uiController = uiController;
        this.element = <HTMLDivElement>document.getElementById("CodeEditor");
        this.editorElement = <HTMLDivElement>document.getElementById("CECodeEditor");
        this.consoleElement = <HTMLDivElement>document.getElementById("CEConsole");
        this.directoryStructure = <HTMLDivElement>document.getElementById("CEDirectoryStructure");
        this.currentFile = null;
        this.separators = [];

        let separators = <HTMLCollectionOf<HTMLDivElement>>this.element.getElementsByClassName("verticalSeparator");
        for (let separator of separators) {
            this.separators.push(new VariableSeparator(separator, separator.previousElementSibling));
        }

        this.editor = CodeMirror(this.editorElement, {
            lineNumbers: true,
            mode: "javascript",
            value: "adasdasd"
        });

        this.editor.on("change", (e) => {
            clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => {
                this.uiController.viewStates.codeEditor.saveFile(e.getValue());
            }, 1000);
        });
    }

    display() {
        this.element.classList.remove("hidden");
        this.visible = true;
        this.editor.refresh();
    };

    hide() {
        this.element.classList.add("hidden");
        this.visible = false;
    };
}

export {CodeEditorUI}
