import * as THREE from "../threejs/three.module.js"
import * as BASIC_OBJECT from "./basicObject.module.js"
import { LOADER_TYPE } from "../loader/loader.module.js"

class Planet extends BASIC_OBJECT.Sphere{

    constructor(name, radius, fileType="jpg", textureDir = undefined, bumpDir = undefined){
        super(name, radius);
        this.type = "Planet Object";
        this.textureName = name + "_TEXTURE";
        this.bumpName = name + "_BUMP";
        if (textureDir == undefined){
            this.textureDir = `./src/${name}/map.${fileType}`;
        }
        if (bumpDir == undefined){
            this.bumpDir = `./src/${name}/bump.${fileType}`;
        }
        this.loaderManager.addLoader(this.textureName, LOADER_TYPE.TEXTURE, this.textureDir);
        this.loaderManager.addLoader(this.bumpName, LOADER_TYPE.TEXTURE, this.bumpDir);

        this.SHADER = {
            "vertexShader" : `
                varying vec2 vertexUV;
                varying vec3 vertexNormal;
                uniform sampler2D globeBump;
                void main (){
                    vertexUV = uv;
                    vertexNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + 0.25*texture2D(globeBump, uv).xyz, 1.0);
                }
            `,
            "fragmentShader" : `
                uniform sampler2D globeTexture;
                varying vec2 vertexUV;
                varying vec3 vertexNormal;
                void main(){
                    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
                    vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);
                    gl_FragColor = vec4(atmosphere + texture2D(globeTexture, vertexUV).xyz, 0.9);
                }
            `
        }

    }

    setMaterial(){

        this._mat = new THREE.ShaderMaterial({
            vertexShader: this.SHADER["vertexShader"],
            fragmentShader: this.SHADER["fragmentShader"],
            uniforms: {
                globeTexture: {
                    value: this.loaderManager.getLoadersByName(this.textureName).data
                },
                globeBump: {
                    value: this.loaderManager.getLoadersByName(this.bumpName).data
                }
            }
        });

    }
}

export { Planet }