import CodeMirror from 'codemirror';
import {UIController} from '../UIController';

export class ConsoleUI {
    uiController: UIController;
    element: HTMLDivElement;
    consoleInputElement: HTMLDivElement;
    consoleLogElement: HTMLDivElement;
    codeInput: CodeMirror.Editor;
    scrollBarBound: boolean;

    constructor(uiController: UIController) {
        this.uiController = uiController;
        this.element = <HTMLDivElement>document.getElementById('CEConsole');
        this.consoleInputElement = <HTMLDivElement>this.element.getElementsByClassName('consoleInput')[0];
        this.consoleLogElement = <HTMLDivElement>this.element.getElementsByClassName('consoleLog')[0];
        this.scrollBarBound = true;

        this.codeInput = CodeMirror(this.consoleInputElement, {
            lineNumbers: true,
            mode: 'javascript',
            value: '',
        });

        this.consoleLogElement.addEventListener('scroll', () => {
            this.scrollBarBound = this.consoleLogElement.scrollHeight - this.consoleLogElement.scrollTop === this.consoleLogElement.clientHeight;
        });

        //TODO this should be handled here, that's what the InputController is for
        window.addEventListener('keypress', (e) => {
            if (this.codeInput.hasFocus() && e.ctrlKey) {
                switch (e.code) {
                case 'Enter': {
                    let result;
                    {
                        this.uiController.game.runner.run(this.codeInput.getValue());
                    }
                    try {
                        if (result !== undefined) {
                            this.logMessage("");
                        }
                    } catch (e) {
                        this.logError(e);
                    }
                }
                    break;
                case 'KeyB':
                    this.uiController.game.runner.stop();
                    break;
                default:
                    break;
                }
            }
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
