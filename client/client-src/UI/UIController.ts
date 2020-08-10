import {InputController} from "./InputController";
import {Game} from "../game";
import {LoadingUI} from "./UIElements/LoadingUI";
import {AuthUI} from "./UIElements/AuthUI";
import {ServerBrowserUI} from "./UIElements/ServerBrowserUI";
import {LoadingViewState} from "./ViewStates/Loading";
import {AuthViewState} from "./ViewStates/Auth";
import {ServerBrowserViewState} from "./ViewStates/ServerBrowser";
import {GameViewSate} from "./ViewStates/Game";
import {RenderUI} from "./UIElements/RenderUI";

class UIController {
    game: Game;
    activeViewState: any;
    activeKeyMap: any;
    inputController: InputController;
    viewStates: {
        loading: LoadingViewState;
        auth: AuthViewState;
        serverBrowser: ServerBrowserViewState;
        game: GameViewSate;
    };
    uiElements: {
        loadingUI: LoadingUI;
        authUI: AuthUI;
        serverBrowserUI: ServerBrowserUI;
        renderUI: RenderUI;
    };

    constructor(game: Game, inputController: InputController) {
        this.game = game;
        this.activeViewState = null;
        this.activeKeyMap = null;
        this.inputController = inputController;

        this.uiElements = {
            loadingUI: new LoadingUI(this),
            authUI: new AuthUI(this),
            serverBrowserUI: new ServerBrowserUI(this),
            renderUI: new RenderUI(this),
        };

        this.viewStates = {
            loading: new LoadingViewState(game, this, inputController),
            auth: new AuthViewState(game, this, inputController),
            serverBrowser: new ServerBrowserViewState(game, this, inputController),
            game: new GameViewSate(game, this, inputController),
        };

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