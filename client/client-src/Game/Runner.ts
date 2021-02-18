import type {Game} from '../Game';

interface VMContainer extends HTMLIFrameElement {
    contentWindow: HTMLIFrameElement['contentWindow'] & {
        game: Game;
    }
}

class Runner {
    iframe: VMContainer;
    game: Game;

    constructor(game) {
        this.iframe = null;
        this.game = game;
    }

    start() {
        if (!this.iframe) {
            this.iframe = <VMContainer>document.createElement('iframe');
            document.body.appendChild(this.iframe);
            this.iframe.contentWindow.game = this.game;

            const script = document.createElement('script');
            script.innerHTML = `
                console.log = new Proxy(console.log, {
                    apply: (target, that, args) => {
                        target.apply(that, args);
                        game.uiController.uiElements.consoleUI.logMessage(args);
                    }
                });

                console.warn = new Proxy(console.warn, {
                    apply: (target, that, args) => {
                        target.apply(that, args);
                        game.uiController.uiElements.consoleUI.logWarning(args);
                    }
                });

                console.error = new Proxy(console.error, {
                    apply: (target, that, args) => {
                        target.apply(that, args);
                        game.uiController.uiElements.consoleUI.logError(args);
                    }
                });
                
                function require(path){
                    
                
                }
                
                `;
            this.iframe.contentDocument.body.appendChild(script);
        } else {
            throw new Error('Runner is already running');
        }
    }

    stop() {
        this.iframe.parentElement.removeChild(this.iframe);
        this.iframe = null;
    }

    run(code, path?) {
        if (!this.iframe) {
            this.start();
        }
        let environment = 'virtual-fs';
        if (!path) {
            path = `repl-${(Math.floor(new Date().getTime() / 1000) % (10000))}`;
            environment = 'console';
        }

        const sourceMap = `//# sourceURL=${environment}:///${path}`;
        const document = this.iframe.contentDocument;
        const script = document.createElement('script');
        script.innerHTML = `
                 (function(){
                    let module = {
                        exports: {}
                    }
                    let exports = module.exports;
                    /****  ****/
                    
                    ${code}
                    /****/
                    return module;
                 })();
                 ${sourceMap}
                `;
        document.body.appendChild(script);
    }
}

export {Runner};
