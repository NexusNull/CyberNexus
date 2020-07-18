import {UIController} from "../UIController";

class LoadingUI {
    uiController: UIController;
    element: HTMLDivElement;
    loadingBar: HTMLDivElement;
    loadingText: HTMLDivElement;
    visible: boolean;

    constructor(uiController) {
        this.uiController = uiController;
        this.element = <HTMLDivElement>document.getElementById("MainLoading");
        this.loadingBar = <HTMLDivElement>this.element.getElementsByClassName("loadingBar")[0];
        this.loadingText = <HTMLDivElement>this.element.getElementsByClassName("loadingText")[0];
        this.visible = false;
    };

    setProgress(progress) {
        this.loadingBar.style.width = progress + "%";
    };

    setMessage(message) {
        this.loadingText.innerText = message;
    };

    display() {
        this.element.classList.remove("hidden");
        this.visible = true;
    };

    hide() {
        this.element.classList.add("hidden");
        this.visible = false;
    };
}

export {LoadingUI}