import { TextureLoader } from "../threejs/three.module.js";
import { FontLoader } from "../threejs/FontLoader.js";
import { GLTFLoader } from "../threejs/GLTFLoader.js";

const LOADER_TYPE = {
    "TEXTURE": new TextureLoader(),
    "FONT": new FontLoader(),
    "GLTF": new GLTFLoader()
}

class Loader{

    constructor(name, loader, loadDir){
        this.name = name;
        this.loader = loader;
        this.loadDir = loadDir;
        this.targets = [];
        this.data = undefined;
    }

    getStatus(){
        return this.data == undefined ? false : true;
    }

    init(){
        console.log("Start loading");
        this.status = this.loader.load(this.loadDir, (response) => {
            this.data = response;
        })
    }
}
  

/**
 * A manager to manage all the loaders, this is for initializing the 
 * main page.
 */
class LoadManager {

    /**
     * Create a Loader manager
     */
    constructor(){
        this.loaders = [];
        this.isInit = false;
    }

    /**
     * Add a loader to the manager.
     * @param {String} name name of the loader
     * @param {LOADER_TYPE} loader loader type
     * @param {String} loadDir loader directory
     */
    addLoader(name, loader, loadDir){
        this.loaders.push(new Loader(name, loader, loadDir))
    }

    /**
     * Check if the loader finish loading and 
     * gets the loader by it's name.
     * @param {String} name The name of target loader
     * @returns target loader 
     */
    getLoadersByName(name){

        if (!this.isInit){
            this.isInit = true;
            this.init();
        }

        if (!this.getStatus()){
            console.log("Not Loaded Yet!");
            return NaN;
        }

        for (let loader of this.loaders){
            if (loader.name == name){
                return loader;
            }
        }

        console.warn(`Not getting any loaders of ${name}`);
        return NaN;
    }

    getStatus(){

        for (let loader of this.loaders){
            if (! loader.getStatus()){
                return false;
            }
        }
        return true;

    }

    init(){
        for (let loader of this.loaders){
            loader.init();
        }
    }
}

const loaderManager = new LoadManager();

export { loaderManager, LOADER_TYPE }