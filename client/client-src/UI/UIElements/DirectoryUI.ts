import {FileUI} from './FileUI';
import {ContextMenuUI, SelectionDef} from '../UIHelpers/ContextMenuUI';
import {FileSystemUI} from "./FileSystemUI";

export class DirectoryUI {
    fileSystemUI: FileSystemUI;
    parent: DirectoryUI | null;
    name: string;
    collapsed: boolean;
    element: HTMLDivElement;
    childContainer: HTMLDivElement;
    header: HTMLDivElement;
    children: Map<string, DirectoryUI | FileUI>;
    depth: number;

    constructor(FileSystemUI: FileSystemUI, name: string) {
        this.fileSystemUI = FileSystemUI;
        this.parent = null;
        this.name = name;
        this.collapsed = true;
        this.children = new Map();
        this.depth = 0;

        this.element = document.createElement('div');
        this.element.classList.add('directory', 'collapsed');
        this.element.draggable = true;

        this.element.innerHTML = `
                <div class="directoryTop">
                    <img class="directoryArrow" src="/icons/arrow-collapsed.svg" alt>
                    <img class="directoryIcon" src="/icons/directory.svg" alt>
                    <span class="directoryName">${name}</span>
                </div>
                <div class="childContainer hidden">
                </div>`;

        this.header = <HTMLDivElement>this.element.getElementsByClassName('directoryTop')[0];
        this.childContainer = <HTMLDivElement>this.element.getElementsByClassName('childContainer')[0];

        this.header.getElementsByClassName('directoryArrow')[0].addEventListener('click', (e) => {
            e.cancelBubble = true;
            e.preventDefault();
            this.toggle();
        });

        this.element.addEventListener('click', (e) => {
            if (e.detail % 2 != 0) // double click gate
            {
                return;
            }
            e.cancelBubble = true;
            e.preventDefault();
            this.toggle();
        });

        this.element.addEventListener('contextmenu', (e) => {
            e.preventDefault();

            e.cancelBubble = true;
            const contextMenu = new ContextMenuUI();
            const contextContent: SelectionDef[] = [
                {type: "hl"},
                {
                    type: "selection",
                    text: "asd",
                    fn: () => console.log("asd")
                },
            ];

            contextMenu.setStructure(contextContent);
            contextMenu.display({x: e.clientX, y: e.clientY});
        });
    }

    rename(newName: string): void {
        this.name = newName;
        const dirName = <HTMLSpanElement>this.element.getElementsByClassName('directoryName')[0];
        dirName.innerText = newName;
    }

    toggle(): void {
        if (this.collapsed) {
            this.expand();
        } else {
            this.collapse();
        }
    }

    collapse(): void {
        this.collapsed = true;

        const arrow = <HTMLImageElement>this.element.getElementsByClassName('directoryArrow')[0];
        arrow.src = '/icons/arrow-collapsed.svg';

        this.childContainer.classList.add('hidden');
    }

    expand(): void {
        this.collapsed = false;

        const arrow = <HTMLImageElement>this.element.getElementsByClassName('directoryArrow')[0];
        arrow.src = '/icons/arrow-expanded.svg';

        this.childContainer.classList.remove('hidden');
    }

    getChild(name: string): FileUI | DirectoryUI {
        return this.children.get(name);
    }

    addChild(fsElement: FileUI | DirectoryUI): void {
        fsElement.setDepth(this.depth + 1);
        this.children.set(fsElement.name, fsElement);
        for (const child of this.childContainer.children) { //TODO optimize
            if (child.classList.contains('directory') && fsElement.element.classList.contains('directory')) {
                const childElement = <HTMLSpanElement>child.getElementsByClassName('directoryName')[0];
                const elementName = fsElement.name;
                if (childElement.innerText.localeCompare(elementName) > -1) {
                    this.childContainer.insertBefore(fsElement.element, child);
                    return;
                }
            } else if (child.classList.contains('file') && fsElement.element.classList.contains('file')) {
                const childElement = <HTMLSpanElement>child.getElementsByClassName('fileName')[0];
                const elementName = fsElement.name;
                if (childElement.innerText.localeCompare(elementName) > -1) {
                    this.childContainer.insertBefore(fsElement.element, child);
                    return;
                }
            } else if (child.classList.contains('file') && fsElement.element.classList.contains('directory')) {
                // insertBefore
                this.childContainer.insertBefore(fsElement.element, child);
                return;
            }
        }
        this.childContainer.appendChild(fsElement.element);
        fsElement.setDepth(this.depth + 1);
    }

    getPath(): string {
        let path = '';
        let current: DirectoryUI = this; // eslint-disable-line @typescript-eslint/no-this-alias
        while (current.parent) {
            path = '/' + current.name + path;
            current = current.parent;
        }
        return path;
    }

    removeChild(name: string): void {
        const child = this.children.get(name);
        this.element.removeChild(child.element);
        this.children.delete(name);
    }

    renameChild(name: string, newName: string): void {
        if (this.children.has('newName')) {
            throw new Error(`${newName} is already taken`);
        }
        if (!this.children.has(name)) {
            throw new Error(`${name} doesn't exist`);
        }

        const child = this.children.get(name);
        this.children.delete(name);
        this.children.set(newName, child);
    }

    setDepth(depth: number): void {
        this.header.style.paddingLeft = 13 * depth + "px";
        this.depth = depth;
        for (const element of this.children) {
            element[1].setDepth(depth + 1);
        }
    }
}
