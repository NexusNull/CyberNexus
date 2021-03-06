import {Action} from "./Action";

export interface KeyCombo {
    code: string,
    modifiers?: {
        shiftKey?: boolean
        altKey?: boolean
        metaKey?: boolean
        ctrlKey?: boolean
    }
    action?: Action
}
