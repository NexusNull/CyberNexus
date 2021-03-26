import {DirectoryUI} from './DirectoryUI';
import {UIController} from '../UIController';

export class FileSystemUI {
    uiController: UIController;
    container: HTMLDivElement;
    rootElements: DirectoryUI[];
    reloadButton: HTMLDivElement;
    updateBlock: boolean;

    constructor(uiController: UIController) {
        this.uiController = uiController;
        this.container = <HTMLDivElement>document.getElementById('CEDirectoryStructure').getElementsByClassName("directoryContainer")[0];
        this.reloadButton = <HTMLDivElement>document.getElementById('CEDirectoryStructure').getElementsByClassName("reloadButton")[0];
        this.rootElements = [];
        this.updateBlock = false;
        this.reloadButton.addEventListener("click", () => {
            if (this.updateBlock)
                return;
            this.uiController.viewStates.codeEditor.fileSystemManager.queueFullFetch();
            this.updateBlock = true;
            window.setTimeout(() => {
                this.updateBlock = false;
            }, 3 * 1000);
        });
    }

    addRootElement(element: DirectoryUI): void {
        this.rootElements.push(element);
        this.container.appendChild(element.element);
    }

}
