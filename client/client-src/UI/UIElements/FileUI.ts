import {DirectoryUI} from './DirectoryUI';
import {ContextMenuUI} from '../UIHelpers/ContextMenuUI';
import {FileSystemUI} from "./FileSystemUI";
import {EventSystem} from "../../util/EventSystem";

export class FileUI extends EventSystem {
    fileSystemUI: FileSystemUI;
    parent: DirectoryUI | null;

    name: string;
    element: HTMLDivElement;
    hidden: boolean;
    depth: number;

    constructor(fileSystemUI: FileSystemUI, name: string) {
        super();
        this.fileSystemUI = fileSystemUI;
        this.parent = null;

        this.name = name;

        this.element = document.createElement('div');
        this.element.classList.add('file', 'script');
        this.element.draggable = true;

        this.element.innerHTML = `
            <img class="fileIcon" src="" alt="">
            <span class="fileName">${name}</span>
        `;

        this.setFileIcon(this.getExtension());
        this.element.addEventListener('click', (e) => {
            e.cancelBubble = true;
            this.emit("click", this);
        });

        this.element.addEventListener('contextmenu', (e) => {
            e.preventDefault();

            e.cancelBubble = true;
            const contextMenu = new ContextMenuUI();
            const contextContent = [];

            contextMenu.setStructure(contextContent);
            contextMenu.display({x: e.clientX, y: e.clientY});
        });
    }

    setFileIcon(ext: string): void {
        const fileIcon = <HTMLImageElement>this.element.getElementsByClassName('fileIcon')[0];
        switch (ext) {
        case 'js':
            fileIcon.src = '/icons/file-js.svg';
            break;
        case 'txt':
            fileIcon.src = '/icons/file-txt.svg';
            break;
        default:
            fileIcon.src = '/icons/file-unknown.svg';
        }
    }

    rename(newName: string): void {
        this.name = newName;
        const fileName = <HTMLSpanElement>this.element.getElementsByClassName('fileName')[0];
        fileName.innerText = newName;
    }

    getPath(): string {
        let path = '';
        let current: DirectoryUI | FileUI = this; // eslint-disable-line @typescript-eslint/no-this-alias
        while (current.parent) {
            path = '/' + current.name + path;
            current = current.parent;
        }
        return path;
    }

    getExtension(): string {
        return this.name.split('.').slice(-1)[0];
    }

    select(): void {
        this.element.classList.add('selected');
    }

    unselect(): void {
        this.element.classList.remove('selected');
    }

    setDepth(depth) {
        this.element.style.paddingLeft = 13 * depth + 11+ "px";
        this.depth = depth;
    }

}
