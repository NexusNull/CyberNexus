import {UIController} from "../UIController";

class CodeEditorUI {
    uiController: UIController;
    element: HTMLDivElement;
    visible: boolean;
    separators: HTMLCollectionOf<HTMLDivElement>;

    constructor(uiController: UIController) {
        this.uiController = uiController;
        this.element = <HTMLDivElement>document.getElementById("CodeEditor");
        this.separators = <HTMLCollectionOf<HTMLDivElement>>this.element.getElementsByClassName("separator");

    }

    display() {
        this.element.classList.remove("hidden");
        this.visible = true;
    };

    hide() {
        this.element.classList.add("hidden");
        this.visible = false;
    };
}

export {CodeEditorUI}