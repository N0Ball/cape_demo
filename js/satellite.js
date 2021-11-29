import { Sphere } from "./modules/object/basicObject.module.js" 

class Satellite extends Sphere{

    constructor(name, orbitColor, moduleDir){
        this.name = name;
        this.orbitColor = orbitColor;
        this._loader = new Loader(new GLTFLoader(), )
    }

}

export default { Satellite }