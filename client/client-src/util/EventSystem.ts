export class EventSystem {
    listeners: Map<string, Array<(any) => void>>;

    constructor() {
        this.listeners = new Map();
    }

    on(eventName: string, callback: (any?) => void): void {
        if (this.listeners.has(eventName)) {
            this.listeners.get(eventName).push(callback);
        } else {
            this.listeners.set(eventName, [callback]);
        }
    }

    async emit(eventName: string, data?: unknown): Promise<void> {
        const listeners = this.listeners.get(eventName);
        if (!listeners) {
            return;
        }

        for (const listener of listeners) {
            try {
                await listener(data);
            } catch (e) {
                console.error(e);
            }
        }
    }

    remove(eventName: string, callback: () => void): void {
        const listeners = this.listeners.get(eventName);
        const i = listeners.indexOf(callback);
        listeners.splice(i, 1);
    }
}
