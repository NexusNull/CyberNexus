/**
 * Think of this object as a stage, a stage doesn't act on it's own, it gets acted upon.
 */


import {Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer} from "three";
import {DisplayWorld} from "./DisplayWorld";


class GameScene {
    isRendering: boolean;
    requestAnimationFrameID: number;

    scene: Scene;
    mainCamera: PerspectiveCamera;
    renderer: WebGLRenderer;

    chunkContainer: Object3D;
    world: Object3D;
    displayWorld: DisplayWorld;

    constructor(canvas: HTMLCanvasElement) {
        this.isRendering = false;
        this.requestAnimationFrameID = null;

        this.scene = new Scene();
        this.mainCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer({canvas});


        this.world = new Object3D();
        this.chunkContainer = new Object3D();

        this.scene.add(this.world);
        this.scene.add(this.chunkContainer);

        this.displayWorld = new DisplayWorld();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        (function (camera, pointerCaptureElement) {
            camera.rotation.order = "YXZ";

            let hasPointerLock = function () {
                return document.pointerLockElement === pointerCaptureElement ;
            };

            let requestPointerLock = function () {
                pointerCaptureElement.requestPointerLock();
            };

            pointerCaptureElement.addEventListener("click", function () {
                if (hasPointerLock()) {

                } else {
                    requestPointerLock();
                }
            });

            window.addEventListener("mousemove", function (event) {
                if (hasPointerLock()) {
                    camera.rotation.y += event.movementX * -0.002;
                    camera.rotation.x = Math.max(Math.min(camera.rotation.x + (event.movementY * -0.002), Math.PI / 2), -Math.PI / 2);
                }
            });

            let keys: any = {};
            document.addEventListener("keydown", function (event) {
                keys[event.code] = true;
            });
            document.addEventListener("keyup", function (event) {
                keys[event.code] = false;
            });
            let speed = .1;
            setInterval(function () {
                if (keys.Space) {
                    let dir = (new Vector3(0, 1, 0)).applyQuaternion(camera.quaternion).multiplyScalar(speed);
                    camera.position.add(dir);
                }
                if (keys.ShiftLeft) {
                    let dir = (new Vector3(0, -1, 0)).applyQuaternion(camera.quaternion).multiplyScalar(speed);
                    camera.position.add(dir);
                }
                if (keys.KeyW) {
                    let dir = (new Vector3(0, 0, -1)).applyQuaternion(camera.quaternion).multiplyScalar(speed);
                    camera.position.add(dir);
                }
                if (keys.KeyS) {
                    let dir = (new Vector3(0, 0, 1)).applyQuaternion(camera.quaternion).multiplyScalar(speed);
                    camera.position.add(dir);
                }
                if (keys.KeyA) {
                    let dir = (new Vector3(-1, 0, 0)).applyQuaternion(camera.quaternion).multiplyScalar(speed);
                    camera.position.add(dir);
                }
                if (keys.KeyD) {
                    let dir = (new Vector3(1, 0, 0)).applyQuaternion(camera.quaternion).multiplyScalar(speed);
                    camera.position.add(dir);
                }
            }, 16);
        })(this.mainCamera, document.getElementById("main"));
    }

    render(delta) {
        if (this.isRendering) {
            this.requestAnimationFrameID = requestAnimationFrame(this.render.bind(this));
        }
        this.renderer.render(this.scene, this.mainCamera);
    }

    startRender() {
        if (!this.isRendering) {
            this.isRendering = true;
            this.requestAnimationFrameID = requestAnimationFrame(this.render.bind(this));
        }
    }

    stopRender() {
        this.isRendering = false;
        cancelAnimationFrame(this.requestAnimationFrameID);
    }

    /**
     * This function disposes all object on the gameScene and prepares for new addition
     */
    clear() {

    }

}

export {GameScene}