import CodeMirror from 'codemirror';
import {UIController} from '../UIController';

export class ConsoleUI {
    uiController: UIController;
    element: HTMLDivElement;
    consoleInputElement: HTMLDivElement;
    consoleLogElement: HTMLDivElement;
    codeInput: CodeMirror.Editor;
    scrollBarBound: boolean;
    buttons: {
        startRunner: HTMLDivElement,
        startConsole: HTMLDivElement,
        restart: HTMLDivElement,
        stop: HTMLDivElement,
    };

    constructor(uiController: UIController) {
        this.uiController = uiController;
        this.element = <HTMLDivElement>document.getElementById('CEConsole');
        this.consoleInputElement = <HTMLDivElement>this.element.getElementsByClassName('consoleInput')[0];
        this.consoleLogElement = <HTMLDivElement>this.element.getElementsByClassName('consoleLog')[0];
        this.scrollBarBound = true;

        this.buttons = {
            startRunner: <HTMLDivElement>this.element.getElementsByClassName("startRunner")[0],
            startConsole: <HTMLDivElement>this.element.getElementsByClassName("startConsole")[0],
            restart: <HTMLDivElement>this.element.getElementsByClassName("restart")[0],
            stop: <HTMLDivElement>this.element.getElementsByClassName("stop")[0],
        };

        this.buttons.startRunner.addEventListener("click", () => {
            uiController.viewStates.codeEditor.startRunner();
        });

        this.codeInput = CodeMirror(this.consoleInputElement, {
            lineNumbers: true,
            mode: 'javascript',
            value: '',
        });

        this.consoleLogElement.addEventListener('scroll', () => {
            this.scrollBarBound = this.consoleLogElement.scrollHeight - this.consoleLogElement.scrollTop === this.consoleLogElement.clientHeight;
        });
    }

    refresh(): void {
        this.codeInput.refresh();
    }

    updateScrollPosition(): void {
        if (this.scrollBarBound) {
            this.consoleLogElement.scrollTo(0, this.consoleLogElement.scrollHeight);
        }
    }

    logError(object: string): HTMLDivElement {
        const element = this.logMessage(object);
        element.classList.add('logError');
        return element;
    }

    logWarning(object: string): HTMLDivElement {
        const element = this.logMessage(object);
        element.classList.add('logWarning');
        return element;
    }

    logMessage(object: string): HTMLDivElement {
        const element = document.createElement('div');
        element.classList.add('logMessage');
        element.innerText = object;
        this.consoleLogElement.appendChild(element);
        this.updateScrollPosition();
        return element;
    }
}
