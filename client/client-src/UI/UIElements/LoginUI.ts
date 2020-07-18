import {UIController} from "../UIController";

class LoginUI {
    uiController: UIController
    element: HTMLDivElement;
    loginForm: HTMLFormElement;
    visible: boolean;

    constructor(uiController) {
        var self = this;
        this.uiController = uiController;
        this.element = <HTMLDivElement>document.getElementById("login");
        this.loginForm = <HTMLFormElement>this.element.getElementsByTagName("form")[0];

        this.loginForm.addEventListener("submit", function (e) {
            let data = {};
            for (let inputElements of self.loginForm.getElementsByTagName("input")) {
                data[inputElements.name] = inputElements.value;
            }
            console.log(data);
            e.preventDefault();

        });
        this.visible = false;
    }

    display() {
        this.element.classList.remove("hidden");
        this.visible = true;
    };

    hide() {
        this.element.classList.add("hidden");
        this.visible = false;
    };
}

export {LoginUI}