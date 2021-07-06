import {InputController} from './InputController';
import {Game} from '../Game';
import {LoadingUI} from './UIElements/LoadingUI';
import {AuthUI} from './UIElements/AuthUI';
import {ServerBrowserUI} from './UIElements/ServerBrowserUI';
import {LoadingViewState} from './ViewStates/Loading';
import {AuthViewState} from './ViewStates/Auth';
import {ServerBrowserViewState} from './ViewStates/ServerBrowser';
import {GameViewSate} from './ViewStates/Game';
import {RenderUI} from './UIElements/RenderUI';
import {FileSystemUI} from './UIElements/FileSystemUI';
import {CodeEditorUI} from './UIElements/CodeEditorUI';
import {CodeEditorViewState} from './ViewStates/CodeEditor';
import {ConsoleUI} from './UIElements/ConsoleUI';
import {ViewState} from "./ViewStates/ViewState";

export class UIController {
    game: Game;
    activeViewState: ViewState;
    inputController: InputController;
    uiElements: {
        loadingUI: LoadingUI;
        authUI: AuthUI;
        serverBrowserUI: ServerBrowserUI;
        renderUI: RenderUI;
        codeEditorUI: CodeEditorUI;
        fileSystemUI: FileSystemUI;
        consoleUI: ConsoleUI;
    };
    viewStates: {
        loading: LoadingViewState;
        auth: AuthViewState;
        serverBrowser: ServerBrowserViewState;
        game: GameViewSate;
        codeEditor: CodeEditorViewState;
    };


    constructor(game: Game, inputController: InputController) {
        this.game = game;
        this.activeViewState = null;
        this.inputController = inputController;

        this.uiElements = {
            loadingUI: new LoadingUI(this),
            authUI: new AuthUI(this),
            serverBrowserUI: new ServerBrowserUI(this),
            renderUI: new RenderUI(this),
            fileSystemUI: new FileSystemUI(this),
            codeEditorUI: new CodeEditorUI(this),
            consoleUI: new ConsoleUI(this),
        };

        this.viewStates = {
            loading: new LoadingViewState(game, this, inputController),
            auth: new AuthViewState(game, this, inputController),
            serverBrowser: new ServerBrowserViewState(game, this, inputController),
            game: new GameViewSate(game, this, inputController),
            codeEditor: new CodeEditorViewState(game, this, inputController),
        };
    }

    async changeViewState(viewState: ViewState): Promise<void> {
        if (this.activeViewState) {
            console.log('current:' + this.activeViewState.constructor.name + ' new:' + viewState.constructor.name);
            await this.activeViewState.disable();
        }
        if (!viewState.isSetup) {
            await viewState.setup();
            viewState.isSetup = true;
        }
        await viewState.enable();
        this.activeViewState = viewState;
    }
}
