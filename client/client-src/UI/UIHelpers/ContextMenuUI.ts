export type SelectionDef = hl | selection | subSelection;

export interface hl {
    type: "hl"
}

export interface selection {
    type: "selection"
    fn: () => void
    text: string
}

export interface subSelection {
    type: "subSelection",
    fn: () => void
    structure: SelectionDef
}

export class ContextMenuUI {
    element: HTMLDivElement;
    shadow: HTMLDivElement;
    destroyed: boolean;
    subMenus: Array<ContextMenuUI>;
    parent: ContextMenuUI;

    constructor(parent?: ContextMenuUI) {
        this.destroyed = false;
        this.parent = parent;

        if (this.parent) {
            this.shadow = this.parent.shadow;
        } else {
            this.shadow = document.createElement('div');
            this.shadow.classList.add('contextMenuShadow');
            this.shadow.addEventListener('click', (e) => {
                if (e.target === this.shadow) {
                    this.destroy();
                }
            });
        }

        this.element = document.createElement('div');
        this.element.classList.add('contextMenu');
        this.subMenus = [];
    }

    setStructure(structure: SelectionDef[]): void {
        this.element.innerHTML = '';
        for (const declaration of structure) {
            if (!declaration) {
                continue;
            }
            let elem;
            switch (declaration.type) {
            case 'hl':
                this._horizontalLine();
                break;
            case 'selection':
                elem = this._selection(declaration);
                break;
            case 'subSelection':
                elem = this._subSelection(declaration);
                break;
            }
            if (!elem) {
                continue;
            }
            this.element.appendChild(elem);
        }
    }

    display(position: { x: number, y: number }): void {
        if (this.parent == null) {
            document.body.appendChild(this.shadow);
        }

        this.shadow.appendChild(this.element);
        this.element.style.left = position.x + 'px';
        this.element.style.top = position.y + 'px';
    }

    destroy(): void {
        if (!this.destroyed) {
            document.body.removeChild(this.shadow);
            this.destroyed = true;
        }
    }

    private _subSelection(declaration) {
        const elem = document.createElement('div');
        elem.classList.add('contextMenuSubSelection');
        elem.innerText = declaration.text;
        elem.addEventListener('click', (e) => {
            e.cancelBubble = true;
            const subMenu = new ContextMenuUI(this);
            this.subMenus.push(subMenu);
            subMenu.setStructure(declaration.structure);
            subMenu.display({
                x: elem.getBoundingClientRect().right + 6,
                y: elem.getBoundingClientRect().y + elem.getBoundingClientRect().height / 2 - 2,
            });
        });
        return elem;
    }

    private _selection(declaration) {
        const elem = document.createElement('div');
        elem.classList.add('contextMenuSelection');
        elem.innerText = declaration.text;
        if (typeof declaration.fn === 'function') {
            elem.addEventListener('click', () => {
                this.destroy();
                try {
                    declaration.fn();
                } catch (e) {
                    console.error(e);
                }
            });
        }
        return elem;
    }

    private _horizontalLine() {
        const elem = document.createElement('div');
        elem.classList.add('horizontalSeparator');
        return elem;
    }
}
