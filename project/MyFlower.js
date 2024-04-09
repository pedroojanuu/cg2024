import {CGFappearance, CGFobject} from '../lib/CGF.js';
import { MyPetal } from './MyPetal.js';
import { MyReceptacle } from './MyReceptacle.js';
import { MyStem } from './MyStem.js';
/**
 * MyFlower
 * @constructor
 * @param scene - Reference to MyScene object
 * @param petalsNo
 * @param receptacleRadius
 */

/*
    Raio exterior das pétalas
    Número de pétalas
    Côr das pétalas

    Raio do círculo do coração da flor
    Côr do círculo do coração da flor

    Raio do cilindro do caule
    Tamanho do caule (número de cilindros do caule)
    Côr do caule

    Côr das folhas
*/
export class MyFlower extends CGFobject {
	constructor(
        scene,
        exteriorRadius, petalsNo, petalsColor,
        receptacleRadius, receptacleColor,
        stemRadius, stemSize, stemColor,
        leavesColor
    ) {
		super(scene);

        this.petalsRadius = (exteriorRadius - receptacleRadius)/2;
        this.petals = [];
        for (var i = 0; i < petalsNo; i++) {
            this.petals.push(new MyPetal(scene, (exteriorRadius - receptacleRadius)/2));
        }

        this.receptacleRadius = receptacleRadius;
        this.receptacle = new MyReceptacle(scene, 10, 10, receptacleRadius);

        this.stemRadius = stemRadius;
        this.stems = [];
        for (var i = 0; i < stemSize; i++) {
            this.stems.push(new MyStem(scene, 10, 10, stemRadius));
        }
	}

	updateBuffers() {}

    enableNormalViz() {this.sphere.enableNormalViz();}
    disableNormalViz() {this.sphere.disableNormalViz();}

    display() {
        for (var i = 0; i < this.petals.length; i++) {
            let petal = this.petals[i];
            let angle = i * 2*Math.PI / this.petals.length;
            this.scene.pushMatrix();
            this.scene.rotate(angle, 0, 0, 1);
            this.scene.translate(0, this.receptacleRadius + this.petalsRadius, 0);
            petal.display();
            this.scene.popMatrix();
        }

        this.receptacle.display();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        for (var i = 0; i < this.stems.length; i++) {
            let stem = this.stems[i];
            this.scene.pushMatrix();
            this.scene.translate(0, 0, i);
            stem.display();
            this.scene.popMatrix();
        }
        this.scene.popMatrix();
    }
}
