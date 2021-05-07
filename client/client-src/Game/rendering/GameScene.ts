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
    }

    render() {
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
        //TODO investigate
        console.log("We are supposed to clear here but didn't do anything. FIX IT");
    }
}
