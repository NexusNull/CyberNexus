import { KeyCombo } from "./KeyCombo";


export interface Action {
    name: string
    active: boolean
    keyDown: () => void
    keyUp: () => void
    keyPress: () => void
    defaultKeyCombo: KeyCombo
    keyCombo: KeyCombo
}
