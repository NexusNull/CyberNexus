class CodeEditorUI {
    element: HTMLDivElement;
    visible: boolean;
    separators: HTMLCollectionOf<HTMLDivElement>;

    constructor() {
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