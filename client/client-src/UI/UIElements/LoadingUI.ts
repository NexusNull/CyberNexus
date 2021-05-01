import {UIController} from '../UIController';

export class LoadingUI {
    uiController: UIController;
    element: HTMLDivElement;
    loadingBar: HTMLDivElement;
    loadingText: HTMLDivElement;
    visible: boolean;

    constructor(uiController: UIController) {
        this.uiController = uiController;
        this.element = <HTMLDivElement>document.getElementById('MainLoading');
        this.loadingBar = <HTMLDivElement>this.element.getElementsByClassName('loadingBar')[0];
        this.loadingText = <HTMLDivElement>this.element.getElementsByClassName('loadingText')[0];
        this.visible = false;
    }

    setProgress(progress: number): void {
        this.loadingBar.style.width = progress + '%';
    }

    setMessage(message: string): void {
        this.loadingText.innerText = message;
    }

    display(): void {
        this.element.classList.remove('hidden');
        this.visible = true;
    }

    hide(): void {
        this.element.classList.add('hidden');
        this.visible = false;
    }
}
