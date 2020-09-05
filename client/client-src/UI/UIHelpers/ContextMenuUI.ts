import {UIController} from "../UIController";

class ContextMenuUI {
    element: HTMLDivElement;
    shadow: HTMLDivElement;
    destroyed: boolean;
    subMenus: Array<ContextMenuUI>;
    parent: ContextMenuUI;

    constructor(parent?: ContextMenuUI) {
        this.destroyed = false;
        this.parent = parent;

        if (this.parent)
            this.shadow = this.parent.shadow;
        else {
            this.shadow = document.createElement("div")
            this.shadow.classList.add("contextMenuShadow");
            this.shadow.addEventListener("click", (e) => {
                if (e.target === this.shadow)
                    this.destroy();
            });
        }

        this.element = document.createElement("div");
        this.element.classList.add("contextMenu");
        this.subMenus = [];

    }

    setStructure(structure) {
        this.element.innerHTML = "";
        for (let declaration of structure) {
            let elem;
            switch (declaration.type) {
                case "hl":
                    elem = document.createElement("div");
                    elem.classList.add("horizontalSeparator");
                    break;
                case "selection":
                    elem = document.createElement("div");
                    elem.classList.add("contextMenuSelection");
                    elem.innerText = declaration.text;
                    if (typeof declaration.fn === "function") {
                        elem.addEventListener("click", () => {
                            this.destroy();
                            try {
                                declaration.fn();
                            } catch (e) {
                                console.error(e);
                            }
                        });
                    }
                    break;
                case "subSelection":
                    elem = document.createElement("div");
                    elem.classList.add("contextMenuSubSelection");
                    elem.innerText = declaration.text;
                    elem.addEventListener("click", (e) => {
                        e.cancelBubble = true;
                        let subMenu = new ContextMenuUI(this);
                        this.subMenus.push(subMenu);
                        subMenu.setStructure(declaration.structure);
                        subMenu.display({
                            x: elem.getBoundingClientRect().right + 6,
                            y: elem.getBoundingClientRect().y + elem.getBoundingClientRect().height / 2 - 2
                        });
                    });
                    break;
            }
            this.element.appendChild(elem);
        }
    }

    display(position) {
        if (this.parent == null)
            document.body.appendChild(this.shadow);

        this.shadow.appendChild(this.element);
        this.element.style.left = position.x + "px";
        this.element.style.top = position.y + "px";
    }

    destroy() {
        if (!this.destroyed) {
            document.body.removeChild(this.shadow);
            this.destroyed = true;
        }
    }

}

export {ContextMenuUI}