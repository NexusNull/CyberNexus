import {UIController} from "../UIController";

class RenderUI {
    uiController: UIController;
    canvas: HTMLCanvasElement;

    constructor(uiController) {
        this.uiController = uiController;
        this.canvas = <HTMLCanvasElement>document.getElementById("main");

    }

}

export {RenderUI}