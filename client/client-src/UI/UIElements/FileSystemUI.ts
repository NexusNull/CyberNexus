import {DirectoryUI} from './DirectoryUI';
import {UIController} from '../UIController';

export class FileSystemUI {
    uiController: UIController;
    container: HTMLDivElement;
    rootElements: DirectoryUI[];

    constructor(uiController: UIController) {
        this.uiController = uiController;
        this.container = <HTMLDivElement>document.getElementById('CEDirectoryStructure').getElementsByClassName("directoryContainer")[0];
        this.rootElements = [];

    }

    addRootElement(element: DirectoryUI): void {
        this.rootElements.push(element);
        this.container.appendChild(element.element);
    }

}
