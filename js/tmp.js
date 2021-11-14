import { Stage } from "./modules/object/stage.module.js"
import { Planet } from "./modules/object/advObject.module.js"
import { loaderManager } from "./modules/loader/loader.module.js"

class TmpStage extends Stage{
    firstLoad(){
        console.log(planet);
        planet.body.rotation.y = .6;
        planet.body.rotation.z = -.5;

        const topPos = canvas.getObjectPosition('planet', -6, -4);
        const botPos = canvas.getObjectPosition('planet', 6, 4);
        const carousel = document.getElementById('carousel');
        
        carousel.style = `
            position: absolute;
            top: ${topPos.y}px;
            left: ${topPos.x}px;
        `;
        console.log(- topPos.x + botPos.x);
        carousel.style.width = - topPos.x + botPos.x + 'px';
        console.log(- topPos.y + botPos.y);
        carousel.style.height = - topPos.y + botPos.y + 'px';
        console.log(carousel.style.height);
        console.log(carousel);

    }

    onLoad(){}

    notLoad(){}
}

const stage = new TmpStage();
const planet = new Planet("planet", 6.5);

stage.addCanvas('planet');
const canvas = stage.getCanvas('planet');
canvas.addAmbientLight();
canvas.camera.translateZ(14);

canvas.addScene(planet);
loaderManager.init();

function animate(){
    requestAnimationFrame(animate);
    stage.update();
}

animate();