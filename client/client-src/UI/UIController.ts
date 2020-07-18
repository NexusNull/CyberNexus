import {InputController} from "./InputController";
import {Game} from "../game";
import {LoadingUI} from "./UIElements/LoadingUI";
import {LoadingViewState} from "./ViewStates/Loading";
import {LoginViewState} from "./ViewStates/Login";
import {LoginUI} from "./UIElements/LoginUI";

class UIController {
    game: Game;
    activeViewState: any;
    activeKeyMap: any;
    inputController: InputController;
    viewStates: {
        loading: LoadingViewState;
        login: LoginViewState;
    };
    uiElements: {
        loadingUI: LoadingUI;
        loginUI: LoginUI;
    };

    constructor(game: Game, inputController: InputController) {
        this.game = game;
        this.activeViewState = null;
        this.activeKeyMap = null;
        this.inputController = inputController;

        this.viewStates = {
            loading: new LoadingViewState(game, this, inputController),
            login: new LoginViewState(game, this, inputController),
        };

        this.uiElements = {
            loadingUI: new LoadingUI(this),
            loginUI: new LoginUI(this),
        }
    };

    changeViewState(viewState) {
        if (this.activeViewState) {
            console.log("current:" + this.activeViewState.constructor.name + " new:" + viewState.constructor.name);
            if (typeof this.activeViewState.disable == "function")
                this.activeViewState.disable();
            else
                console.error("ViewState needs disable");
        }
        if (typeof viewState.enable == "function") {
            viewState.enable();
            this.activeViewState = viewState;
        }
    };
}

export {UIController};