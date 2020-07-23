import {InputController} from "./InputController";
import {Game} from "../game";
import {LoadingUI} from "./UIElements/LoadingUI";
import {LoadingViewState} from "./ViewStates/Loading";
import {AuthViewState} from "./ViewStates/Auth";
import {AuthUI} from "./UIElements/AuthUI";
import {DebugViewState} from "./ViewStates/Debug";
import {ServerBrowserViewState} from "./ViewStates/ServerBrowser";
import {ServerBrowserUI} from "./UIElements/ServerBrowserUI";

class UIController {
    game: Game;
    activeViewState: any;
    activeKeyMap: any;
    inputController: InputController;
    viewStates: {
        loading: LoadingViewState;
        auth: AuthViewState;
        debug: DebugViewState;
        serverBrowser: ServerBrowserViewState
    };
    uiElements: {
        loadingUI: LoadingUI;
        authUI: AuthUI;
        serverBrowserUI: ServerBrowserUI;
    };

    constructor(game: Game, inputController: InputController) {
        this.game = game;
        this.activeViewState = null;
        this.activeKeyMap = null;
        this.inputController = inputController;

        this.viewStates = {
            loading: new LoadingViewState(game, this, inputController),
            auth: new AuthViewState(game, this, inputController),
            debug: new DebugViewState(game, this, inputController),
            serverBrowser: new ServerBrowserViewState(game, this, inputController),
        };

        this.uiElements = {
            loadingUI: new LoadingUI(this),
            authUI: new AuthUI(this),
            serverBrowserUI: new ServerBrowserUI(this),
        }
    };

    async changeViewState(viewState) {
        if (this.activeViewState) {
            console.log("current:" + this.activeViewState.constructor.name + " new:" + viewState.constructor.name);
            await this.activeViewState.disable();
        }
        if (!viewState.isSetup) {
            await viewState.setup();
            viewState.isSetup = true;
        }
        await viewState.enable();
        this.activeViewState = viewState;
    };
}

export {UIController};