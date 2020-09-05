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
    children: Map<string, DirectoryUI | FileUI>;

    constructor(fileSystemUI: FileSystemUI, parent: DirectoryUI, name: string) {

        this.fileSystemUI = fileSystemUI;
        this.parent = parent;
        this.name = name;
        this.collapsed = true;
        this.children = new Map();

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
            parent.addChild(this);
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
                                    this.addChild(new DirectoryUI(this.fileSystemUI, this, nameElement.value))

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
                                    this.addChild(new FileUI(this.fileSystemUI, this, nameElement.value))
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
                            this.parent.removeChild(this.name);
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

    getChild(name: string): FileUI | DirectoryUI {
        return this.children.get(name);
    }

    addChild(fsElement: FileUI | DirectoryUI) {
        this.children.set(fsElement.name, fsElement);
        for (let child of this.childContainer.children) {
            if (child.classList.contains("directory") && fsElement.element.classList.contains("directory")) {
                let childElement = <HTMLSpanElement>child.getElementsByClassName("directoryName")[0];
                let elementName = fsElement.name;
                if (childElement.innerText.localeCompare(elementName) > -1) {
                    this.childContainer.insertBefore(fsElement.element, child);
                    return;
                }
            } else if (child.classList.contains("file") && fsElement.element.classList.contains("file")) {
                let childElement = <HTMLSpanElement>child.getElementsByClassName("fileName")[0];
                let elementName = fsElement.name;
                if (childElement.innerText.localeCompare(elementName) > -1) {
                    this.childContainer.insertBefore(fsElement.element, child);
                    return;
                }
            } else if (child.classList.contains("file") && fsElement.element.classList.contains("directory")) {
                //insertBefore
                this.childContainer.insertBefore(fsElement.element, child);
                return;
            }
        }
        this.childContainer.appendChild(fsElement.element);
    }


    removeChild(name: string) {
        let child = this.children.get(name);
        this.element.removeChild(child.element);
        this.children.delete(name);
    }

    renameChild(name: string, newName: string) {
        if (this.children.has("newName"))
            throw new Error(`${newName} is already taken`);
        if (!this.children.has(name))
            throw new Error(`${name} doesn't exist`);

        let child = this.children.get(name);
        this.children.delete(name);
        this.children.set(newName, child);
    }
}

export {DirectoryUI};