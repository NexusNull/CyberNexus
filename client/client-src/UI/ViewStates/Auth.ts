import {ViewState} from "./ViewState";
import {Game} from "../../game";
import {UIController} from "../UIController";
import {InputController} from "../InputController";
import {util} from "../../util/Util";

class AuthViewState extends ViewState {
    constructor(game: Game, uiController: UIController, inputController: InputController) {
        super(game, uiController, inputController);

    }

    async disable(): Promise<any> {
        this.uiController.uiElements.authUI.hide();
    }

    async enable(): Promise<any> {
        let authToken = util.getCookie("authToken");
        let response
        if (authToken) {
            try {
                response = await this.sendRequest("/auth/validateToken", {authToken});
                if (response.valid)
                    this.authCompleted();
            } catch (e) {
                console.error(e);
            }
        }
        if (response && response.valid) {
            util.setCookie("authToken", "", 0)
            this.uiController.uiElements.authUI.display();
        }
    }

    async setup(): Promise<any> {

    }

    authCompleted() {
        this.uiController.uiElements.authUI.clearForms();
        this.uiController.changeViewState(this.uiController.viewStates.debug);
    }

    async login(name, password) {
        let response;
        try {
            response = await this.sendRequest("/auth/login", {name, password});
        } catch (e) {
            this.uiController.uiElements.authUI.loginError(e);
        }

        if (response) {
            util.setCookie("authToken", response.authToken, 32);
            this.authCompleted();
        }
    }

    async register(name, email, password) {

    }

    sendRequest(url, data): any {
        return new Promise(function (resolve, reject) {

            var xobj = new XMLHttpRequest();
            xobj.open('POST', url, true);
            xobj.setRequestHeader("Content-type", "application/json");
            xobj.timeout = 1000;

            xobj.onreadystatechange = function () {
                if (xobj.readyState === XMLHttpRequest.DONE) {
                    let data = null;

                    if (xobj.status == 0)
                        reject("Request timed out");


                    switch (xobj.status) {
                        case 200:
                        case 400:
                            try {
                                data = JSON.parse(xobj.responseText);
                            } catch (e) {
                                reject("Unable to parse Server response");
                                console.error(e);
                                break;
                            }

                            if (xobj.status == 200)
                                resolve(data);
                            else
                                reject(data.message);

                            break;
                        default:
                            reject(`Unknown status code in response: ${xobj.status}`);
                            break;
                    }
                }
            };

            xobj.send(JSON.stringify(data));
        });
    }
}

export {AuthViewState}