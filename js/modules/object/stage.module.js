import * as THREE from "../threejs/three.module.js"
import { loaderManager } from "../loader/loader.module.js"

const mouse = new THREE.Vector2();

class StageCanvas{

    constructor(canvasName){
        this.canvasName = canvasName;
        this.canvas= document.getElementById(canvasName);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.canvas.offsetWidth / this.canvas.offsetHeight,
            0.1,
            1000
        ); 
        this.renderer = new THREE.WebGL1Renderer({
            antialias: true,
            canvas: this.canvas
        });
        this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.objects = [];
        this.sceneAdd = false;
    }

    addScene(object){
        this.objects.push(object);
    }

    update(){

        if (!this.sceneAdd){
            console.log("Still Loading");
            if (loaderManager.getStatus()){
                this.sceneAdd = true;
                for (let object of this.objects){
                    this.scene.add(object.getMesh());
                }
            }
        }

        for (let object of this.objects){
            object.update();
        }

        this.renderer.render(this.scene, this.camera);
    }

    addAmbientLight(color="white"){
        const light = new THREE.AmbientLight(color);
        this.scene.add(light);
    }

    getObjectPosition(objectName, offsetX = 0, offsetY = 0, offsetZ = 0){
        
        for (let object of this.objects){
            if (object.name == objectName){
                let width = window.innerWidth, height = window.innerHeight;
                let widthHalf = width / 2, heightHalf = height / 2;

                let pos = object.body.position.clone();
                pos.x += offsetX;
                pos.y += offsetY;
                pos.z += offsetZ;

                pos.project(this.camera);
                pos.x = ( pos.x * widthHalf) + widthHalf;
                pos.y = ( pos.y * heightHalf) + heightHalf;

                return {
                    "x": pos.x,
                    "y": pos.y
                };
            }
        }
    }
}

class Stage{

    constructor(){

        this.canvases = [];
        this.loaded = false;
        window.addEventListener( 'resize', this.onWindowResize );
    }

    /**
     * Add a canvas to the stage.
     * @param {String} canvasName the dom element ID of the canvas
     */
    addCanvas(canvasName){
        this.canvases.push(new StageCanvas(canvasName));
    }

    /**
     * Get the stage canvas by giving it's name;
     * @param {string} canvasName 
     * @returns {StageCanvas}
     */
    getCanvas(canvasName){
        
        for(let canvas of this.canvases){
            if (canvas.canvasName == canvasName){
                return canvas;
            }
        }
        
        return NaN;
    }

    fistLoad(){}
    onLoad(){}
    notLoad(){}

    onWindowResize() {

        for (let canvas of this.canvases){
            canvas.camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
            canvas.camera.updateProjectionMatrix();
            canvas.renderer.setSize( canvas.offsetWidth, canvas.offsetHeight );
        }

    }

    update(){
        
        for(let canvas of this.canvases){
            canvas.update();
        }

        if (loaderManager.getStatus()){
            if (!this.loaded){
                this.loaded = true;
                this.firstLoad();
            }

            this.onLoad();
        }else{
            this.notLoad();
        }

    }

}

window.addEventListener('mousemove', (e)=> {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / innerHeight) * 2 + 1;
})

export { Stage };