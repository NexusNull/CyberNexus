import {DirectoryUI} from './DirectoryUI';
import type {UIController} from '../UIController';
import util from "../../util/Util";
import {FileUI} from "./FileUI";


export class FileSystemUI {
    uiController: UIController;
    container: HTMLDivElement;
    rootElements: Map<string, DirectoryUI>;
    reloadButton: HTMLDivElement;
    updateBlock: boolean;


    constructor(uiController: UIController) {
        this.uiController = uiController;
        this.container = <HTMLDivElement>document.getElementById('CEDirectoryStructure').getElementsByClassName("directoryContainer")[0];
        this.reloadButton = <HTMLDivElement>document.getElementById('CEDirectoryStructure').getElementsByClassName("reloadButton")[0];

        this.rootElements = new Map();
        this.updateBlock = false;

        this.reloadButton.addEventListener("click", async () => {
            if (this.updateBlock)
                return;
            this.updateBlock = true;
            await this.uiController.game.fileSystemManager.fullFetch();
            this.updateBlock = false;
        });

        this.uiController.game.fileSystemManager.on("created", (data) => {
            const pathElements = util.parsePath(data.filename);
            let element;
            if (data.type == "directory") {
                element = new DirectoryUI(this, data.basename);
            } else {
                element = new FileUI(this, data.basename);

            }

            if (pathElements.length == 1) {
                this.addRootElement(pathElements[0], element);
            } else {
                let parent: DirectoryUI | FileUI = this.rootElements.get(pathElements[0]);
                for (const intermediate of pathElements.slice(1, -1)) {
                    if (parent instanceof DirectoryUI)
                        parent = parent.getChild(intermediate);
                    else
                        throw new Error("Intermediate found that isn't a directory");
                }
                if (parent instanceof DirectoryUI)
                    parent.addChild(element);
                else
                    throw new Error("Intermediate found that isn't a directory");
            }
        });
    }

    addRootElement(name: string, element: DirectoryUI): void {
        this.rootElements.set(name, element);
        this.container.appendChild(element.element);
    }

}
