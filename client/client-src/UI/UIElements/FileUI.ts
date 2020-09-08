import {FileSystemUI} from "./FileSystemUI";
import {DirectoryUI} from "./DirectoryUI";
import {ContextMenuUI} from "../UIHelpers/ContextMenuUI";
import {default as newOps} from "../ContextGroups/newOps";
import {default as updateOps} from "../ContextGroups/updateOps";

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
            <img class="fileIcon" src="" alt="">
            <span class="fileName">${name}</span>
        `;

        this.setFileIcon(this.getExtension());
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

        this.element.addEventListener("contextmenu", (e) => {
            e.preventDefault();

            e.cancelBubble = true;
            let contextMenu = new ContextMenuUI();
            let contextContent = [];
            if (this.parent)
                updateOps(contextContent, this);

            contextMenu.setStructure(contextContent);
            contextMenu.display({x: e.clientX, y: e.clientY});
        });

    }

    setFileIcon(ext) {
        console.log(ext)
        let fileIcon = <HTMLImageElement>this.element.getElementsByClassName("fileIcon")[0];
        switch (ext) {
            case "js":
                fileIcon.src = "/icons/file-js.svg";
                break;
            case "txt":
                fileIcon.src = "/icons/file-txt.svg";
                break;
        }
    }

    rename(newName) {
        this.name = newName;
        let fileName = <HTMLSpanElement>this.element.getElementsByClassName("fileName")[0]
        fileName.innerText = newName;
    }

    getPath() {
        let path = "";
        let current: DirectoryUI | FileUI = this;
        while (current.parent) {
            path = "/" + current.name + path;
            current = current.parent;
        }
        return path;
    }

    getExtension() {
        return this.name.split(".").slice(-1)[0];

    }

    select() {
        this.element.classList.add("selected")
    }

    unselect() {
        this.element.classList.remove("selected")
    }
}

export {FileUI}