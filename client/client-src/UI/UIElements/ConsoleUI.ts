import CodeMirror from "codemirror";
import {UIController} from "../UIController";

class ConsoleUI {
    uiController: UIController;
    element: HTMLDivElement;
    consoleInputElement: HTMLDivElement;
    consoleLogElement: HTMLDivElement;
    codeInput: CodeMirror.Editor;
    scrollBarBound: boolean;

    constructor(uiController: UIController) {
        this.uiController = uiController;
        this.element = <HTMLDivElement>document.getElementById("CEConsole");
        this.consoleInputElement = <HTMLDivElement>this.element.getElementsByClassName("consoleInput")[0];
        this.consoleLogElement = <HTMLDivElement>this.element.getElementsByClassName("consoleLog")[0];
        this.scrollBarBound = true;

        this.codeInput = CodeMirror(this.consoleInputElement, {
            lineNumbers: true,
            mode: "javascript",
            value: "setInterval(()=>{console.error(123)},500)"
        });

        this.consoleLogElement.addEventListener("scroll", (e) => {
            this.scrollBarBound = this.consoleLogElement.scrollHeight - this.consoleLogElement.scrollTop === this.consoleLogElement.clientHeight;
        });

        window.addEventListener("keypress", (e) => {
            console.log(e)
            if (this.codeInput.hasFocus() && e.ctrlKey) {
                switch (e.code) {
                    case "Enter":
                        let result;
                    {
                        this.uiController.game.runner.run(this.codeInput.getValue());
                    }
                        try {
                            if (result !== undefined)
                                this.logMessage(result);
                        } catch (e) {
                            this.logError(e)
                        }
                        break;
                    case "KeyB":
                        this.uiController.game.runner.stop();
                        break;
                    default:
                        break;
                }

            }
        });
    }

    refresh() {
        this.codeInput.refresh();
    }

    updateScrollPosition() {
        if (this.scrollBarBound)
            this.consoleLogElement.scrollTo(0, this.consoleLogElement.scrollHeight);
    }

    logError(object) {
        let element = this.logMessage(object);
        element.classList.add("logError");
        return element;
    }

    logWarning(object) {
        let element = this.logMessage(object);
        element.classList.add("logWarning");
        return element;
    }

    logMessage(object) {
        let element = document.createElement("div");
        element.classList.add("logMessage");
        element.innerText = object;
        this.consoleLogElement.appendChild(element);
        this.updateScrollPosition();
        return element;
    }
}

export {ConsoleUI}