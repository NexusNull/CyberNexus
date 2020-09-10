

class Runner {
    iframe: HTMLIFrameElement;


    constructor() {
        this.iframe = null;
    }

    start(path) {
        if (!this.iframe) {
            this.iframe = document.createElement("iframe");
            document.body.appendChild(this.iframe);
            {
                let document = this.iframe.contentDocument;
                let script = document.createElement("script");
                script.innerHTML = "setInterval(()=>console.log(1),1000)";
                document.body.appendChild(script);
            }

        } else {
            throw new Error("Runner is already running");
        }
    }

    stop() {
        this.iframe.parentElement.removeChild(this.iframe);
        this.iframe = null;
    }
}

export {Runner}