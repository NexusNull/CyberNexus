import {UIController} from '../UIController';

export class RenderUI {
    uiController: UIController;
    canvas: HTMLCanvasElement;

    constructor(uiController: UIController) {
        this.uiController = uiController;
        this.canvas = <HTMLCanvasElement>document.getElementById('main');
    }
}
