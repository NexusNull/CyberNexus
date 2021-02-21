import {DirectoryUI} from './DirectoryUI';
import {FileUI} from './FileUI';
import {UIController} from '../UIController';

export class FileSystemUI {
    uiController: UIController;
    container: HTMLDivElement;
    rootElements: DirectoryUI[];

    constructor(uiController: UIController) {
        this.uiController = uiController;
        this.container = <HTMLDivElement>document.getElementById('CEDirectoryStructure');
        this.rootElements = [];

    }

    addRootDir(element: DirectoryUI): void {
        this.rootElements.push(element);
        this.container.appendChild(element.element);
    }

}
