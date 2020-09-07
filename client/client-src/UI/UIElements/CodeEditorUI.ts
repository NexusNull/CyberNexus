import {UIController} from "../UIController";
import CodeMirror from 'codemirror';
import {FileUI} from "./FileUI";

class CodeEditorUI {
    uiController: UIController;
    element: HTMLDivElement;
    visible: boolean;
    separators: HTMLCollectionOf<HTMLDivElement>;
    editor: CodeMirror.Editor;
    editorElement: HTMLDivElement;
    currentFile: FileUI;
    saveTimeout: number;

    constructor(uiController: UIController) {
        this.uiController = uiController;
        this.element = <HTMLDivElement>document.getElementById("CodeEditor");
        this.separators = <HTMLCollectionOf<HTMLDivElement>>this.element.getElementsByClassName("separator");
        this.editorElement = <HTMLDivElement>document.getElementById("CECodeEditor");
        this.currentFile = null;


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