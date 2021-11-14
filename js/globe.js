import * as THREE from "./threejs/three.module.js"
import {FontLoader} from "./threejs/FontLoader.js"
import {TextGeometry} from "./threejs/TextGeometry.js";
import {Flow} from "./threejs/CurveModifier.js";
import {GLTFLoader} from './threejs/GLTFLoader.js'
import SHADER from "./threejs/shaders.js"

const canvasContainer = document.getElementById('earth');

const mouse = {
    x: 0,
    y: 0
}

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(
    75, 
    canvasContainer.offsetWidth / canvasContainer.offsetHeight,
    0.1,
    1000
);

export const renderer = new THREE.WebGL1Renderer({
    antialias: true,
    canvas: document.getElementById('earth')
});
renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);

export const satellites = new THREE.Group();
export const satelliteBodys = [];
let font = undefined;

class Satellite{
    constructor(orbitColor, bodyColor, phase=0, xRotate=0, yRotate=0, orbitHeight=6 + (Math.random()-0.5)){
        this.orbitColor = orbitColor;
        this.orbitHeight = orbitHeight;
        this.phase = phase;
        this.xRotate = xRotate;
        this.yRotate = yRotate;
        this.group = new THREE.Group();

        this.initOrbit(orbitColor);
        this.initBody(bodyColor);
    }

    initOrbit(orbitColor){
        const curve = new THREE.EllipseCurve(
            0, 0,
            this.orbitHeight, this.orbitHeight,
            0, 2 * Math.PI,
            false,
            0 
        )
        this.orbit = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)),
            new THREE.LineBasicMaterial({
                color: orbitColor
            })
        )
    }

    initBody(bodyColor){
        const loader = new GLTFLoader();
        loader.load('/inc/cubesat_3u.gltf', (gltf) => {
            this.body = gltf.scene.children[0];
            this.body.rotateZ(this.phase);
            this.body.translateX(this.orbitHeight);
            this.body.rotateZ(Math.PI / 2);
            this.body.scale.set(1.5, 1.5, 1.5);

            this.group.add(this.body);
            satellites.add(this.group);
            satelliteBodys.push(this.group);
        })
    }

    create(){
        this.group.add(this.orbit);
        this.group.rotateX(this.xRotate);
        this.group.rotateY(this.yRotate);
    }
}

const light = new THREE.AmbientLight( 0xFFFFFF );
scene.add( light );

class TextSatellite extends Satellite{

    constructor(text, orbitColor, bodyColor, phase=0, xRotate=0, yRotate=0){
        super(orbitColor, bodyColor, phase, xRotate, yRotate, 6.5);
        this.orbitColor = orbitColor;
        this.text = text;
        this.tmpGroup = new THREE.Group();
        this.flow;
        this.textMesh;
    }

    initBody(bodyColor){

        let initialPoints = [];

        for (const point of Array.from(Array(100).keys())){
            let x = this.orbitHeight * Math.cos(point * 2*Math.PI / 100);
            let y = 0;
            let z = this.orbitHeight * Math.sin(point * 2*Math.PI / 100);
            initialPoints.push(new THREE.Vector3(
                x * Math.cos(-3),
                x * Math.sin(-3),
                z
            ));
        }

        const curve = new THREE.CatmullRomCurve3(
            initialPoints
        );

        const loader = new FontLoader();
        loader.load('/inc/Spider Home_Regular.json', (response) => {
            font = response;
            const geometry = new TextGeometry( this.text, {
                font: font,
                size: 1,
                height: 0.05,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.02,
                bevelSize: 0.01,
                bevelOffset: 0,
                bevelSegments: 5,
            } );

            geometry.rotateX(Math.PI);
            geometry.translate(0, .5, 0);

            const material = new THREE.MeshBasicMaterial( {
                color: bodyColor
            } );

            this.textMesh = new THREE.Mesh( geometry, material);

            this.flow = new Flow( this.textMesh );
            this.flow.updateCurve( 0, curve );
            scene.add( this.flow.object3D );
        });

    }

    create(){

        this.tmpGroup = new THREE.Group();

    }
}

new Satellite(0xF7DC6F, 0xEB984E).create();
new Satellite(0xD98880, 0xD5F5E3, 0, -2.1, 0).create();
new Satellite(0xFFFFFF, 0x85C1E9, 2, 3, 1).create();
new Satellite(0x2ECC71, 0xECF0F1, 3, 1, 2).create();
const text = new TextSatellite("Welcome to CAPE", 0xFF0000, 0xFFFFFF, 0, 1.6, 0);
text.create();


scene.add(satellites);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50), 
    new THREE.ShaderMaterial({
        vertexShader: SHADER.globeVertexShader(),
        fragmentShader: SHADER.globeFragmentShader(),
        uniforms: {
            globeTexture: {
                value: new THREE.TextureLoader().load('/img/earth/EarthMap.jpg')
            },
            globeBump: {
                value: new THREE.TextureLoader().load('/img/earth/BumpMap.jpg')
            }
        }
    })
);

const cloud = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
    new THREE.ShaderMaterial({
        vertexShader: SHADER.cloudVertexShader(),
        fragmentShader: SHADER.cloudFragmentShader(),
        uniforms: {
            clouds: {
                value: new THREE.TextureLoader().load('/img/earth/CloudsMap.png')
            }
        }
    })
);

export const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50), 
    new THREE.ShaderMaterial({
        vertexShader: SHADER.atmosVertexShader(),
        fragmentShader: SHADER.atmosFragmentShader(),
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
    })
);

scene.add(atmosphere);

const globe= new THREE.Group()
globe.add(sphere);
globe.add(cloud);
scene.add(globe);

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff
})

const starVectices = []
for (let i = 0; i < 1000; i++){
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = - (Math.random() + 0.3) * 500;
    starVectices.push(x, y, z);
}
starGeometry.setAttribute('position',
    new THREE.Float32BufferAttribute(starVectices, 3)
)

const stars = new THREE.Points(
    starGeometry, starMaterial
)
scene.add(stars)

camera.position.z = 15;

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

window.addEventListener( 'resize', onWindowResize );

export function globeAnimation(){
    renderer.render(scene, camera);
    globe.rotateY(0.001);
    cloud.rotateX(0.0002);
    satelliteBodys.forEach(e => {
        e.rotateZ(0.01);
    });
    satellites.rotateY(0.0063);
    try {
        text.flow.moveAlongCurve(0.0005);
    } catch (error) {
        console.log(error);
    }
    

    globe.rotateY(mouse.x * 0.0025); 
    globe.rotateX(-mouse.y * 0.0025);
    satellites.rotateY(mouse.x * 0.0025);
    satellites.rotateY(-mouse.y * 0.0025);
}

addEventListener('mousemove', (e)=> {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / innerHeight) * 2 + 1;
})
