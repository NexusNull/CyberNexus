import {ViewState} from "./ViewState";
import {Game} from "../../game";
import {UIController} from "../UIController";
import {InputController} from "../InputController";


class AuthViewState extends ViewState {
    constructor(game: Game, uiController: UIController, inputController: InputController) {
        super(game, uiController, inputController);

    }

    async disable(): Promise<any> {
        this.uiController.uiElements.authUI.hide();
    }

    async enable(): Promise<any> {
        try {
            let userData = await this.sendRequest("/auth/requestUserData");
            this.game.setUserData(userData.id, userData.username);
            this.authCompleted();
            return;
        } catch (e) {
            console.error(e);
        }

        this.uiController.uiElements.authUI.display();
    }

    async setup(): Promise<any> {

    }

    authCompleted() {
        this.uiController.uiElements.authUI.clearForms();
        this.uiController.changeViewState(this.uiController.viewStates.serverBrowser);
    }

    async login(name, password) {
        try {
            let userData = await this.sendRequest("/auth/login", {name, password});
            this.game.setUserData(userData.id, userData.username);
            this.authCompleted();
        } catch (e) {
            this.uiController.uiElements.authUI.loginError(e);
        }
    }

    async register(name, email, password) {

    }

    sendRequest(url, data?): any {
        return new Promise(function (resolve, reject) {
            if (!data)
                data = {};
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
