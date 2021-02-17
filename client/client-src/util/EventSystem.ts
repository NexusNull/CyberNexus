export class EventSystem {
    listeners: Map<string, Array<(any) => void>>;

    constructor() {
        this.listeners = new Map();
    }

    on(eventName, callback) {
        if (this.listeners.has(eventName)) {
            this.listeners.get(eventName).push(callback);
        } else {
            this.listeners.set(eventName, [callback]);
        }
    };

    async emit(eventName: string, data?: any) {
        let listeners = this.listeners.get(eventName);
        if (!listeners)
            return;

        for (let listener of listeners) {
            try {
                await listener(data);
            } catch (e) {
                console.error(e);
            }
        }
    };

    remove(eventName, callback) {
        let listeners = this.listeners.get(eventName);
        let i = listeners.indexOf(callback);
        listeners.splice(i, 1);
    };
}
