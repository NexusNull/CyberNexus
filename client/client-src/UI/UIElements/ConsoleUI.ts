import CodeMirror from "codemirror";

class ConsoleUI {
    element: HTMLDivElement;
    consoleInputElement: HTMLDivElement;
    consoleLogElement: HTMLDivElement;
    codeInput: CodeMirror.Editor;
    consoleExecuteButton: HTMLButtonElement;
    scrollBarBound: boolean;

    constructor(props) {
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
            console.log(e);
            this.scrollBarBound = this.consoleLogElement.scrollHeight - this.consoleLogElement.scrollTop === this.consoleLogElement.clientHeight;
        });

        window.addEventListener("keypress", (e) => {

            if (this.codeInput.hasFocus() && e.ctrlKey && e.code == "Enter") {
                console.log = new Proxy(console.log, {
                    apply: (target, that, args) => {
                        target.apply(that, args);
                        //this.logMessage(args)
                    }
                });

                console.warn = new Proxy(console.warn, {
                    apply: (target, that, args) => {
                        target.apply(that, args);
                        this.logWarning(args)
                    }
                });

                console.error = new Proxy(console.error, {
                    apply: (target, that, args) => {
                        target.apply(that, args);
                        this.logError(args)
                    }
                });

                let result;
                {
                    result = eval(this.codeInput.getValue());
                }
                try {
                    if (result !== undefined)
                        this.logMessage(result);
                } catch (e) {
                    this.logError(e)
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

    logError(e) {
        let element = document.createElement("div");
        element.classList.add("logMessage");
        element.classList.add("logError");
        element.innerText = e;
        this.consoleLogElement.appendChild(element);
        this.updateScrollPosition();
    }

    logWarning(e) {
        let element = document.createElement("div");
        element.classList.add("logMessage");
        element.classList.add("logWarning");
        element.innerText = e;
        this.consoleLogElement.appendChild(element);
        this.updateScrollPosition();
    }

    logMessage(text) {
        let element = document.createElement("div");
        element.classList.add("logMessage");
        element.innerText = text;
        this.consoleLogElement.appendChild(element);
        this.updateScrollPosition();
    }
}

export {ConsoleUI}