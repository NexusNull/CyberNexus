/**
 * Think of this object as a stage, a stage doesn't act on it's own, it gets acted upon.
 */


import {Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer} from 'three';


export class GameScene {
    isRendering: boolean;
    requestAnimationFrameID: number;

    scene: Scene;
    mainCamera: PerspectiveCamera;
    renderer: WebGLRenderer;

    chunkContainer: Object3D;
    world: Object3D;


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

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        (function (camera, pointerCaptureElement) {
            camera.rotation.order = 'YXZ';

            const hasPointerLock = function () {
                return document.pointerLockElement === pointerCaptureElement;
            };

            const requestPointerLock = function () {
                pointerCaptureElement.requestPointerLock();
            };

            pointerCaptureElement.addEventListener('click', function () {
                if (!hasPointerLock()) {
                    requestPointerLock();
                }
            });

            window.addEventListener('mousemove', function (event) {
                if (hasPointerLock()) {
                    camera.rotation.y += event.movementX * -0.002;
                    camera.rotation.x = Math.max(Math.min(camera.rotation.x + (event.movementY * -0.002), Math.PI / 2), -Math.PI / 2);
                }
            });

            const keys: {
                Space?: boolean,
                ShiftLeft?: boolean,
                KeyW?: boolean,
                KeyS?: boolean,
                KeyA?: boolean,
                KeyD?: boolean,
            } = {};
            document.addEventListener('keydown', function (event) {
                keys[event.code] = true;
            });
            document.addEventListener('keyup', function (event) {
                keys[event.code] = false;
            });
            const speed = .1;
            setInterval(function () {
                if (keys.Space) {
                    const dir = (new Vector3(0, 1, 0)).applyQuaternion(camera.quaternion).multiplyScalar(speed);
                    camera.position.add(dir);
                }
                if (keys.ShiftLeft) {
                    const dir = (new Vector3(0, -1, 0)).applyQuaternion(camera.quaternion).multiplyScalar(speed);
                    camera.position.add(dir);
                }
                if (keys.KeyW) {
                    const dir = (new Vector3(0, 0, -1)).applyQuaternion(camera.quaternion).multiplyScalar(speed);
                    camera.position.add(dir);
                }
                if (keys.KeyS) {
                    const dir = (new Vector3(0, 0, 1)).applyQuaternion(camera.quaternion).multiplyScalar(speed);
                    camera.position.add(dir);
                }
                if (keys.KeyA) {
                    const dir = (new Vector3(-1, 0, 0)).applyQuaternion(camera.quaternion).multiplyScalar(speed);
                    camera.position.add(dir);
                }
                if (keys.KeyD) {
                    const dir = (new Vector3(1, 0, 0)).applyQuaternion(camera.quaternion).multiplyScalar(speed);
                    camera.position.add(dir);
                }
            }, 16);
        })(this.mainCamera, document.getElementById('main'));
    }

    render(): void {
        if (this.isRendering) {
            this.requestAnimationFrameID = requestAnimationFrame(this.render.bind(this));
        }
        this.renderer.render(this.scene, this.mainCamera);
    }

    startRender(): void {
        if (!this.isRendering) {
            this.isRendering = true;
            this.requestAnimationFrameID = requestAnimationFrame(this.render.bind(this));
        }
    }

    stopRender(): void {
        this.isRendering = false;
        cancelAnimationFrame(this.requestAnimationFrameID);
    }

    /**
     * This function disposes all object on the gameScene and prepares for new addition
     */
    clear(): void {
        //TODO investigate
        console.log("We are supposed to clear here but didn't do anything. FIX IT");
    }
}
