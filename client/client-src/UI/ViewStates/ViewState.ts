export interface ViewState {
    isSetup: boolean

    setup: () => Promise<void>;
    enable: () => Promise<void>;
    disable: () => Promise<void>;
}
