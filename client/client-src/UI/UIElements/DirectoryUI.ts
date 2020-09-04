import {FileSystemUI} from "./FileSystemUI";
import {FileUI} from "./FileUI";
import {Modal} from "../UIHelpers/Modal";
import {ContextMenuUI} from "../UIHelpers/ContextMenuUI";


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

        this.element.addEventListener("contextmenu", (e) => {
            e.preventDefault();

            e.cancelBubble = true;
            let contextMenu = new ContextMenuUI();
            contextMenu.setStructure([
                {
                    type: "subSelection",
                    text: "New:",
                    structure: [
                        {
                            type: "selection",
                            text: "Directory",
                            fn: () => {
                                let modal = new Modal();
                                let element = document.createElement("div");

                                element.style.background = "#ababab";
                                element.style.padding = "5px";
                                element.innerHTML = `
                                    <form>
                                        <p style="margin: 5px 0">
                                            <input class="inputNewName" name="name" type="text" value="${this.name}" >
                                        </p>
                                        <input class="buttonCancel" type="button" value="Cancel">
                                        <input class="buttonSubmit" style="float:right;" type="submit" value="Create Directory">
                                    </form>
                                `;

                                let form = element.getElementsByTagName("form")[0];
                                let buttonCancel = <HTMLInputElement>element.getElementsByClassName("buttonCancel")[0];

                                form.addEventListener("submit", (e) => {
                                    e.preventDefault();
                                    modal.destroy();

                                    let nameElement = <HTMLInputElement>form.getElementsByClassName("inputNewName")[0];
                                    this.add(new DirectoryUI(this.fileSystemUI, this, nameElement.value))

                                });

                                buttonCancel.addEventListener("click", (e) => {
                                    modal.destroy();
                                });

                                modal.setContent(element);
                                modal.display();
                            }
                        },
                        {
                            type: "selection",
                            text: "File",
                            fn: () => {
                                let modal = new Modal();
                                let element = document.createElement("div");

                                element.style.background = "#ababab";
                                element.style.padding = "5px";
                                element.innerHTML = `
                                    <form>
                                        <p style="margin: 5px 0">
                                            <input class="inputNewName" name="name" type="text" value="${this.name}" >
                                        </p>
                                        <input class="buttonCancel" type="button" value="Cancel">
                                        <input class="buttonSubmit" style="float:right;" type="submit" value="Create File">
                                    </form>
                                `;

                                let form = element.getElementsByTagName("form")[0];
                                let buttonCancel = <HTMLInputElement>element.getElementsByClassName("buttonCancel")[0];

                                form.addEventListener("submit", (e) => {
                                    e.preventDefault();
                                    modal.destroy();

                                    let nameElement = <HTMLInputElement>form.getElementsByClassName("inputNewName")[0];
                                    this.add(new FileUI(this.fileSystemUI, this, nameElement.value))
                                });

                                buttonCancel.addEventListener("click", (e) => {
                                    modal.destroy();
                                });

                                modal.setContent(element);
                                modal.display();
                            }
                        },
                    ],
                },
                {
                    type: "hl"
                },
                {
                    type: "selection",
                    text: "Rename",
                    fn: () => {
                        let modal = new Modal();
                        let element = document.createElement("div");

                        element.style.background = "#ababab";
                        element.style.padding = "5px";
                        element.innerHTML = `
                            <form>
                                <p style="margin: 5px 0">
                                    <input class="inputNewName" name="name" type="text" value="${this.name}" >
                                </p>
                                <input class="buttonCancel" type="button" value="Cancel">
                                <input class="buttonSubmit" style="float:right;" type="submit" value="Rename">
                            </form>
                        `;

                        let form = element.getElementsByTagName("form")[0];
                        let buttonCancel = <HTMLInputElement>element.getElementsByClassName("buttonCancel")[0];

                        form.addEventListener("submit", (e) => {
                            e.preventDefault();
                            modal.destroy();
                            console.log(form);
                            let nameElement = <HTMLInputElement>form.getElementsByClassName("inputNewName")[0];
                            this.rename(nameElement.value);
                        });

                        buttonCancel.addEventListener("click", (e) => {
                            modal.destroy();
                        });

                        modal.setContent(element);
                        modal.display();
                    }
                },
                {
                    type: "selection",
                    text: "Delete",
                    fn: () => {
                        let modal = new Modal();
                        let element = document.createElement("div");


                        element.style.background = "#ababab";
                        element.style.padding = "5px";

                        element.innerHTML = `
                            <p>Are you sure you want to delete the '${this.name}' directory?<br>
                                All files inside will be irrecoverable. 
                            </p>
                            <button class="buttonCancel">Cancel</button>
                            <button class="buttonOK">OK</button>
                        `;

                        let buttonCancel = element.getElementsByClassName("buttonCancel")[0];
                        let buttonOK = element.getElementsByClassName("buttonOK")[0];

                        buttonCancel.addEventListener("click", () => {
                            modal.destroy();
                        });

                        buttonOK.addEventListener("click", () => {
                            this.delete();
                            modal.destroy();
                        });

                        modal.setContent(element);
                        modal.display();
                    }
                }
            ]);
            contextMenu.display({x: e.clientX, y: e.clientY});
        });
    }

    rename(newName) {
        this.name = newName;
        let dirName = <HTMLSpanElement>this.element.getElementsByClassName("directoryName")[0]
        dirName.innerText = newName;
    }

    delete() {
        this.element.parentElement.removeChild(this.element);
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