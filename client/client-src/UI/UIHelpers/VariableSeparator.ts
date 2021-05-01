export class VariableSeparator {
    separator: HTMLDivElement;
    target: HTMLDivElement;
    active: boolean;
    listener: () => void;

    constructor(separator: HTMLDivElement, target: HTMLDivElement) {
        this.target = target;
        this.separator = separator;

        separator.addEventListener('mousedown', () => {
            this.active = true;

            this.target.style.width = this.target.getBoundingClientRect().width + 'px';
            this.listener = this.mouseMove.bind(this);
            window.addEventListener('mousemove', this.listener);
        });

        document.body.addEventListener('mouseup', () => {
            if (this.active) {
                this.active = false;
                window.removeEventListener('mousemove', this.listener);
            }
        });
    }

    mouseMove(e: MouseEvent): void {
        const width = parseInt(this.target.style.width);
        this.target.style.width = width + e.movementX + 'px';
    }
}
