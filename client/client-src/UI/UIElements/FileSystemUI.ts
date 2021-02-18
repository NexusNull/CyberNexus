import {DirectoryUI} from './DirectoryUI';
import {FileUI} from './FileUI';
import {UIController} from '../UIController';

export class FileSystemUI {
    uiController: UIController;
    container: HTMLDivElement;
    rootDir: DirectoryUI;

    constructor(uiController: UIController) {
        this.uiController = uiController;
        this.container = <HTMLDivElement>document.getElementById('CEDirectoryStructure');
        this.rootDir = new DirectoryUI(this, null, 'admin');

        this.container.appendChild(this.rootDir.element);
    }

    addFile(path) {
        const parsedPath = this.parsePath(path);
        let current = this.rootDir;

        for (const segment of parsedPath.segments) {
            const temp = current.getChild(segment);
            if (!(temp instanceof DirectoryUI)) {
                throw new Error(`${segment} is not a directory`);
            }
            current = temp;
        }

        new FileUI(this, current, parsedPath.base);
    }

    addDirectory(path) {
        const parsedPath = this.parsePath(path);
        let current = this.rootDir;

        for (const segment of parsedPath.segments) {
            const temp = current.getChild(segment);
            if (!(temp instanceof DirectoryUI)) {
                throw new Error(`${segment} is not a directory`);
            }
            current = temp;
        }
        new DirectoryUI(this, current, parsedPath.base);
    }

    parsePath(path: string) {
        const elements = path.split('/').filter((elem) => elem.length > 0);
        const segments = elements.slice(0, -1);
        const base = elements.slice(-1)[0];

        const data: { elements: string[], segments: string[], base: string, ext: string } = {
            elements,
            segments,
            base,
            ext: null,
        };

        const split = base.split('.');
        if (split.length > 1) {
            data.ext = '.' + split.slice(-1);
        }

        return data;
    }

    getDirectoryByPath(path): DirectoryUI {
        return null;
    }
}
