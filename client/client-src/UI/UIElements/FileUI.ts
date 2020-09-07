import {FileSystemUI} from "./FileSystemUI";
import {DirectoryUI} from "./DirectoryUI";

class FileUI {
    fileSystemUI: FileSystemUI;
    parent: DirectoryUI;

    name: string;
    element: HTMLDivElement;
    hidden: boolean;

    constructor(fileSystemUI: FileSystemUI, parent: DirectoryUI, name: string) {
        this.fileSystemUI = fileSystemUI;
        this.parent = parent;

        this.name = name;

        this.element = document.createElement("div");
        this.element.classList.add("file", "script");
        this.element.draggable = true;

        this.element.innerHTML = `
            <img class="fileIcon" src="/icons/file-script.svg" alt="">
            <span class="fileName">${name}</span>
        `;

        this.element.addEventListener("click", (e) => {
            e.cancelBubble = true;
            this.fileSystemUI.uiController.viewStates.codeEditor.openFile(this);
        });

        if (parent) {
            let level = 1;
            let current = parent;
            while (current.parent) {
                current = current.parent;
                level++;
            }
            this.element.style.paddingLeft = level * 27 + "px";
            parent.addChild(this);
        }
    }

    getPath() {
        let path = this.name;
        let current = this.parent;
        while (current.parent) {
            path = current.name + "/" + path;
            current = current.parent;
        }
        return "/" + path;
    }

    select() {
        this.element.classList.add("selected")
    }

    unselect() {
        this.element.classList.remove("selected")
    }
}

export {FileUI}