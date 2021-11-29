import * as THREE from "../threejs/three.module.js"
import { loaderManager } from "../loader/loader.module.js"

class BasicObject{

    /**
     * Initialize Basic Object by it's name and color
     * @param {string} name name of the object
     * @param {color} color color of the object
     */
    constructor(name, color){

        if(this.constructor == BasicObject){
            throw new Error(`Object of Abstract Class BasicObject cannot be created!`);
        }
        
        this.name = name;
        this.color = color;
        this.type = undefined;
        this.body = "Mesh not created yet!";
        this.loaderManager = loaderManager;
        this.isMeshed = false;
        this._geo = undefined;
        this._mat = undefined;
    }

    init(){}
    update(){}

    setGeometry(geometry){
        this._geo = geometry;
    }

    setMaterial(material){
        this._mat = material;
    }

    /**
     * returned the mesh object
     * @returns {THREE.Object3D}
     */
    getMesh(){

        if (!this.isMeshed){
            this.init();
            this.body = this._createMesh();
            this.isMeshed = true;
        }

        return this.body;
    }

    _createMesh(){

        if (!this._geo || !this._mat){
            throw new Error(`Can't get Mesh from ${this.name} not setting geometry and mat`);
        }
        
        return new THREE.Mesh(this._geo, this._mat);
    }

}

class Ellipse3D extends BasicObject{

    /**
     * Initialize an ellipse.
     * @param {String} name name of the Object
     * @param {any} color color of the Object
     * @param {Number} majorRadius x Radius
     * @param {Number} priorRadius y Radius
     * @param {Number} step default = 100, amount of points of the ellipse
     */
    constructor(name, color, majorRadius, priorRadius, step=1000){
        super(name, color);

        this.type = "Curve3D";
        this.points = [];
        this._step = step;
        this._a = majorRadius;
        this._b = priorRadius;
        this._curve = undefined;
    }

    _createCurve(){

        for(let i = 0; i < this._step; i++){
            this.points.push(
                new THREE.Vector3(
                    this._a * Math.cos(i / this._step * 2*Math.PI),
                    this._b * Math.sin(i / this._step * 2*Math.PI),
                    0
                )
            )
        }
        
    }

    init() {
        this._createCurve();
        this._curve = new THREE.CatmullRomCurve3(this.points);
        this._curve.closed = true;
        this.setGeometry(new THREE.BufferGeometry().setFromPoints( this._curve.getPoints(this._step) ));
        this.setMaterial(new THREE.LineBasicMaterial({color: this.color}))
    }

    _createMesh(){
        let tmp = new THREE.LineLoop(this._geo, this._mat);
        tmp.position.set(0, 0, 0);
        tmp.rotation.set(0, 0, 0); 
        return tmp;
    }
}

class Sphere extends BasicObject{

    constructor(name, radius, color="red"){
        super(name, color);
        this.type = "Sphere";
        this.radius = radius;
    }

    init(){
        this.setGeometry(new THREE.SphereGeometry(this.radius, 1000, 1000));
        this.setMaterial(new THREE.MeshBasicMaterial({color: this.color}));
    }
}

export { Ellipse3D, Sphere };