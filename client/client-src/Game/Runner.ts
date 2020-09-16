class Runner {
    iframe: HTMLIFrameElement;

    constructor() {
        this.iframe = null;
    }

    start() {
        if (!this.iframe) {
            this.iframe = document.createElement("iframe");
            document.body.appendChild(this.iframe);
            let script = document.createElement("script");
            script.innerHTML = `
                    function require(path){
                        
                    
                    }
                
                `;
            document.body.appendChild(script);
        } else {
            throw new Error("Runner is already running");
        }
    }

    stop() {
        this.iframe.parentElement.removeChild(this.iframe);
        this.iframe = null;
    }

    run(code, path) {
        if (!this.iframe)
            this.start();
        let environment = "virtual-fs";
        if (!path) {
            path = `repl-${(Math.floor(new Date().getTime() / 1000) % (10000))}`;
            environment = "console";
        }

        let sourceMap = `//# sourceURL=${environment}:///${path}`;
        let document = this.iframe.contentDocument;
        let script = document.createElement("script");
        script.innerHTML = `
                 let wrapper = (function(){
                    let module = {
                        exports: {}
                    }
                    let exports = module.exports;
                    /****  ****/
                    
                    ${code}
                    /****/
                    return module;
                 });
                 wrapper();
                 ${sourceMap}
                `;
        document.body.appendChild(script);
    }
}

export {Runner}