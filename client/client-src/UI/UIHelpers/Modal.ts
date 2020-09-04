class Modal {
    shadow: HTMLDivElement;
    element: HTMLElement;

    constructor() {
        this.shadow = document.createElement("div");
        this.shadow.classList.add("modalShadow");

        this.shadow.addEventListener("click", (e) => {
            if (e.target === this.shadow)
                this.destroy();
        });

    }

    setContent(element: HTMLElement) {
        this.shadow.innerHTML = "";
        this.shadow.appendChild(element)
    }

    display() {
        document.body.appendChild(this.shadow);
    }

    destroy() {
        document.body.removeChild(this.shadow);
    }
}

declare let window: any;
window.Modal = Modal;
export {Modal}