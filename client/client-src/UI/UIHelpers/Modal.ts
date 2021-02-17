export class Modal {
    shadow: HTMLDivElement;
    element: HTMLElement;

    constructor() {
        this.shadow = document.createElement("div");
        this.shadow.classList.add("modalShadow");

        this.shadow.addEventListener("mousedown", (e) => {
            if (e.target === this.shadow)
                this.destroy();
        });

    }

    setContent(element: HTMLElement) {
        this.shadow.innerHTML = "";
        this.shadow.appendChild(element);
        this.element = element;
    }

    display() {
        document.body.appendChild(this.shadow);
    }

    destroy() {
        document.body.removeChild(this.shadow);
    }
}