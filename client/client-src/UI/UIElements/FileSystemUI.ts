import {DirectoryUI} from "./DirectoryUI";
import {FileUI} from "./FileUI";
import {UIController} from "../UIController";

class FileSystemUI {
    uiController: UIController;
    container: HTMLDivElement;
    directories: DirectoryUI;
    files: Map<number, FileUI>;
    rootDir: DirectoryUI;

    constructor(uiController: UIController) {
        this.uiController = uiController;
        this.container = <HTMLDivElement>document.getElementById("CEFolderStructure");
        this.rootDir = new DirectoryUI(this, null, "admin");

        this.container.appendChild(this.rootDir.element);
        let test = new DirectoryUI(this, this.rootDir, "test");
        let test1 = new DirectoryUI(this, this.rootDir, "test1");
        let test2 = new DirectoryUI(this, this.rootDir, "test2");
        let test3 = new DirectoryUI(this, this.rootDir, "test3");
        let test4 = new DirectoryUI(this, this.rootDir, "test4");

        let testFile = new FileUI(this, test, "asd.js")
    }

    addFile(path, name, type?) {

    };

    addDirectory(path, name) {

    };

    parsePath(path) {
        let elements = path.split("/").filter((elem) => elem.length > 0);
        return {
            elements,
            basename: elements
        }
    }

    getDirectoryByPath(path): DirectoryUI {
        return null;
    }
}

export {FileSystemUI}