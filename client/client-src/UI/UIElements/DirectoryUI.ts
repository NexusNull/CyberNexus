import {FileSystemUI} from "./FileSystemUI";
import {FileUI} from "./FileUI";

class DirectoryUI {
    fileSystemUI: FileSystemUI;
    parent: DirectoryUI;
    name: string;
    collapsed: boolean;
    element: HTMLDivElement;
    childContainer: HTMLDivElement;
    header: HTMLDivElement;
    contents: Map<string, DirectoryUI | FileUI>

    constructor(fileSystemUI: FileSystemUI, parent: DirectoryUI, name: string) {

        this.fileSystemUI = fileSystemUI;
        this.parent = parent;
        this.name = name;
        this.collapsed = true;

        this.element = document.createElement("div");
        this.element.classList.add("directory", "collapsed");
        this.element.draggable = true;

        this.element.innerHTML = `
                <div class="directoryTop">
                    <img class="directoryArrow" src="/icons/arrow-collapsed.svg" alt>
                    <img class="directoryIcon" src="/icons/directory.svg" alt>
                    <span class="directoryName">${name}</span>
                </div>
                <div class="childContainer hidden">
                </div>`;

        this.header = <HTMLDivElement>this.element.getElementsByClassName("directoryTop")[0];
        this.childContainer = <HTMLDivElement>this.element.getElementsByClassName("childContainer")[0];

        if (parent) {
            let level = 1;
            let current = parent;
            while (current.parent) {
                current = current.parent;
                level++;
            }
            this.header.style.paddingLeft = level * 27 + "px";
            parent.add(this);
        }

        this.element.addEventListener("click", (e) => {
            if (e.detail % 2 != 0) // double click gate
                return;
            e.cancelBubble = true;
            e.preventDefault();
            this.toggle();
        });

    }

    toggle() {
        if (this.collapsed) {
            this.expand();
        } else {
            this.collapse();
        }
    }

    collapse() {
        this.collapsed = true;

        let arrow = <HTMLImageElement>this.element.getElementsByClassName("directoryArrow")[0];
        arrow.src = "/icons/arrow-collapsed.svg";

        this.childContainer.classList.add("hidden")
    }

    expand() {
        this.collapsed = false;

        let arrow = <HTMLImageElement>this.element.getElementsByClassName("directoryArrow")[0];
        arrow.src = "/icons/arrow-expanded.svg";

        this.childContainer.classList.remove("hidden")
    }

    add(fsElement: FileUI | DirectoryUI) {
        this.childContainer.appendChild(fsElement.element);

    }
}

export {DirectoryUI};