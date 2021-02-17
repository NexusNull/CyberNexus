import {UIController} from "../UIController";
import {TabController} from "../UIHelpers/TabController";

class AuthUI {
    uiController: UIController
    element: HTMLDivElement;


    visible: boolean;
    tabController: TabController;

    loginContainer: HTMLDivElement;
    registerContainer: HTMLDivElement;

    loginForm: HTMLFormElement;
    registerForm: HTMLFormElement;

    loginErrorContainer: HTMLDivElement;
    registerErrorContainer: HTMLDivElement;

    constructor(uiController) {
        var self = this;
        this.uiController = uiController;
        this.element = <HTMLDivElement>document.getElementById("authContainer");

        this.loginContainer = <HTMLDivElement>document.getElementById("loginContainer");
        this.registerContainer = <HTMLDivElement>document.getElementById("registerContainer");

        this.loginForm = <HTMLFormElement>this.loginContainer.getElementsByTagName("form")[0];
        this.registerForm = <HTMLFormElement>this.registerContainer.getElementsByTagName("form")[0];

        this.loginErrorContainer = <HTMLDivElement>document.getElementById("loginErrorContainer");
        this.registerErrorContainer = <HTMLDivElement>document.getElementById("loginErrorContainer");

        let navs = document.getElementById("authContainer").getElementsByClassName("tabContainer")[0].children;
        let contents = document.getElementById("authContainer").getElementsByClassName("contentContainer")[0].children;

        this.tabController = new TabController([
            {nav: <HTMLDivElement>navs[0], content: <HTMLDivElement>contents[0]}, // sign in
            {nav: <HTMLDivElement>navs[1], content: <HTMLDivElement>contents[1]} // sign up
        ]);

        this.loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            let name = (<HTMLInputElement>document.getElementById("loginName")).value;
            let password = (<HTMLInputElement>document.getElementById("loginPassword")).value;
            uiController.viewStates.auth.login(name, password);
        });

        this.registerContainer.addEventListener("submit", function (e) {
            e.preventDefault();
        });

        this.visible = false;
    }

    loginError(errorMessage) {
        var self = this;
        let elem = document.createElement("div");
        elem.style.color = "red";
        elem.classList.add("animation-fade");
        elem.innerText = errorMessage;

        this.loginErrorContainer.prepend(elem);

        if (this.loginErrorContainer.children.length > 3) {
            this.loginErrorContainer.removeChild(this.loginErrorContainer.children[3]);
        }
        setTimeout(function () {
            self.loginErrorContainer.removeChild(elem);
        }, 3000);
    }

    clearForms() {
        (<HTMLInputElement>document.getElementById("loginName")).value = "";
        (<HTMLInputElement>document.getElementById("loginPassword")).value = "";
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

export {AuthUI}