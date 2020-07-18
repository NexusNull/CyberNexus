/**
 *
 * The input Controller defines listeners or key PressesMouse lock and .
 * The idea is that once a ViewState is entered it will define what keyCombo should produce what action. When the ViewState changes one needs to call reset to remove old listeners
 * @param uiController
 * @param config
 * @constructor
 */


import {Game} from "../Game";
import {EventSystem} from "../util/EventSystem";

class InputController extends EventSystem {
    actions: Map<string, Action>;
    activeActions: Set<Action>;
    keys: Map<string, KeyCombo[]>;
    config: {
        sensitivityX: number,
        sensitivityY: number,
    };
    game: Game;
    pointerLockElement: HTMLElement;

    constructor(game: Game) {
        super();
        this.game = game;
        this.actions = new Map();
        this.keys = new Map();
        this.activeActions = new Set();
        this.config = {
            sensitivityX: 0.002,
            sensitivityY: 0.002,
        };

        this.pointerLockElement = document.body;
        window.addEventListener("keypress", this.handleKeyPress.bind(this));
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this));
        document.addEventListener("pointerlockchange", this.handlePointerLockChange.bind(this));
        this.pointerLockElement.addEventListener("mousemove", this.handleMouseMove.bind(this));
        this.pointerLockElement.addEventListener("mousedown", this.handleMouseDown.bind(this));

    };

    registerAction(name, defaultKeyCombo: KeyCombo, keyDown?, keyUp?, keyPress?): Action {
        if (typeof defaultKeyCombo !== "object" || typeof defaultKeyCombo.code !== "string") {
            throw new Error("key combo has to be an object containing at least code as key code.");
        }
        if (this.actions.has(name)) {
            console.error("Action:" + name + " is already defined");
        }
        let keyCombo: KeyCombo = {
            code: defaultKeyCombo.code,
            action: null
        };
        if (defaultKeyCombo.modifiers) {
            keyCombo.modifiers = {
                metaKey: defaultKeyCombo.modifiers.metaKey,
                altKey: defaultKeyCombo.modifiers.altKey,
                shiftKey: defaultKeyCombo.modifiers.shiftKey,
                ctrlKey: defaultKeyCombo.modifiers.ctrlKey,
            };
        }

        let action = {
            name: name,
            defaultKeyCombo: defaultKeyCombo,
            keyCombo: keyCombo,
            keyDown: keyDown || (() => {
            }),
            keyUp: keyUp || (() => {
            }),
            keyPress: keyPress || (() => {
            }),
            active: false
        };

        keyCombo.action = action;

        if (this.config[name]) {
            keyCombo = this.config[name];
        }

        action.active = false;
        action.keyCombo = keyCombo;
        this.actions.set(name, action);
        if (this.keys.has(keyCombo.code)) {
            let keyCombos = this.keys.get(keyCombo.code);
            keyCombos.push(keyCombo);
        } else {
            this.keys.set(keyCombo.code, [keyCombo]);
        }

        return action;
    };

    handleKeyDown(event: KeyboardEvent) {
        let keyCombos = this.keys.get(event.code);
        let foundAction = false;
        if (keyCombos)
            for (let keyCombo of keyCombos) {
                if (keyCombo.modifiers) {
                    if (keyCombo.modifiers.altKey === event.altKey)
                        continue;
                    if (keyCombo.modifiers.shiftKey === event.shiftKey)
                        continue;
                    if (keyCombo.modifiers.metaKey === event.metaKey)
                        continue;
                    if (keyCombo.modifiers.ctrlKey === event.ctrlKey)
                        continue;
                }

                try {
                    let action = keyCombo.action;
                    if (action.active) {
                        foundAction = true;
                        keyCombo.action.keyDown();
                        this.activeActions.add(keyCombo.action)
                    }
                } catch (e) {
                    console.error(e)
                }
            }

        if (foundAction) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    handleKeyPress(event: KeyboardEvent) {

    }

    handleKeyUp(event: KeyboardEvent) {

        let foundAction = false;

        for (let action of this.activeActions) {
            let keyCombo = action.keyCombo;
            let hit = false;

            if (keyCombo.code == event.code) {
                hit = true;
            }

            if (keyCombo.modifiers) {
                if (keyCombo.modifiers.altKey !== event.altKey)
                    hit = true;
                if (keyCombo.modifiers.shiftKey !== event.shiftKey)
                    hit = true;
                if (keyCombo.modifiers.metaKey !== event.metaKey)
                    hit = true;
                if (keyCombo.modifiers.ctrlKey !== event.ctrlKey)
                    hit = true;
            }

            if (hit) {
                let action = keyCombo.action;
                if (action.active) {
                    try {
                        foundAction = true;
                        action.keyUp();
                    } catch (e) {
                        console.error(e)
                    }
                }
            }
        }
        if (foundAction) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    /**
     * @emits InputController#pointerLockChange
     * @type boolean
     */
    handlePointerLockChange() {
        this.emit("pointerLockChange", this.hasPointerLock())
    }

    async requestPointerLock() {
        let self = this;
        return new Promise(function (resolve, reject) {
            let lockChange, lockError;
            lockChange = function () {
                resolve(self.hasPointerLock());
                document.removeEventListener('pointerlockerror', lockChange, false);
                document.removeEventListener('pointerlockchange', lockError, false);
            };

            lockError = function () {
                reject();
                document.removeEventListener('pointerlockerror', lockChange, false);
                document.removeEventListener('pointerlockchange', lockError, false);
            };
            self.pointerLockElement.requestPointerLock();
            document.addEventListener('pointerlockchange', lockChange, false);
            document.addEventListener('pointerlockerror', lockError, false);
        });
    }


    handleMouseMove(event) {
        if (!this.hasPointerLock())
            return;

        if (Math.abs(event.movementX) > 100 || Math.abs(event.movementY) > 100)
            return;

        this.emit("lockedMouseMove", {
            rotationY: -event.movementX * this.config.sensitivityX,
            rotationX: -event.movementY * this.config.sensitivityY,
        });
    }

    handleMouseDown(event) {
        if (!this.hasPointerLock())
            return;
        this.emit("lockedMouseDown", event)
    }

    unlockPointer() {
        document.exitPointerLock();
    };

    hasPointerLock() {
        return document.pointerLockElement === this.pointerLockElement;
    }
}

export {
    InputController
};