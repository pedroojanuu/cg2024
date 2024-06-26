import { CGFappearance, CGFobject, CGFtexture } from '../../lib/CGF.js';
import { MyHead } from './Components/MyHead.js';
import { MyTorax } from './Components/MyTorax.js';
import { MyAbdomen } from './Components/MyAbdomen.js';

/**
 * MyBee
 * @constructor
 * @param scene - Reference to MyScene object
 * @param height - height of the bee
 * @param x - initial x position
 * @param y - initial y position
 * @param z - initial z position
 * @param orientation - initial orientation (radians, in XZ plane)
 * @param speed - initial speed in XZ plane
 */
export class MyBee extends CGFobject {
	constructor(scene, height, x, y, z, orientation, speed) {
		super(scene);
        this.scene = scene;
        this.height = height;

        this.scaleFactor = 1;

        this.head = new MyHead(scene, height);
		this.torax = new MyTorax(scene, height);
        this.abdomen = new MyAbdomen(scene, height);

        this.x = x;
        this.y = y;
        this.z = z;
        this.orientation = orientation;
        this.speed = speed;    // [x, z]

		this.initBuffers();

        /*
        0 = free flight, no pollen
        1 = descending
        2 = on flower
        3 = climbing
        4 = free flight, carrying pollen
        5 = delivering pollen to hive
        */
        this.state = 0;

        this.pollen = null;
        this.targetFlower = null;

        this.targetHive = null;

        this.targetX = null;
        this.targetY = null;
        this.targetZ = null;
	}

	updateBuffers() {}

    /**
     * Update bee's position and state, as well as invoking a function to update the torax, which will 
     * is responsible for the wings' movement, based on a received time factor, the speed, and the state.
     * @param t - time factor
     */
    update(t) {
        if (this.state == 0 || this.state == 4) {
            this.y = 0.5*this.height*Math.sin(t/200);
            this.torax.update(t);
            this.x += this.speed[0];
            this.z += this.speed[1];
        } else if (this.state == 1) {
            this.torax.update(t);
            if (this.y <= this.targetY) {
                if (this.targetFlower.pollen != null) {
                    this.pollen = this.targetFlower.pollen;
                    this.targetFlower.pollen = null;
                }
                this.state = 2;
            } else this.y -= 0.3;
        } else if (this.state == 2) {
            // nothing to do
        } else if (this.state == 3) {
            this.torax.update(t);
            if (this.y >= this.targetY) {
                if (this.pollen == null) this.state = 0;
                else this.state = 4;
            } else this.y += 0.3;
        } else if (this.state == 5) {
            this.torax.update(t);
            this.y += 0.5*this.height*Math.sin(t/200);

            if (Math.abs(this.x - this.targetX) <= 0.1 && Math.abs(this.z - this.targetZ) <= 0.1) {
                this.targetHive.addPollen(this.pollen);
                this.pollen = null;

                this.speed = [0, 0];
                this.turn(Math.PI);

                this.state = 0;
            } else {
                this.x += this.speed[0];
                this.z += this.speed[1];
            }
        }
    }

    /**
     * If in free flight, turns the bee's orientation by a given angle, and updates the speed vector.
     * @param v - angle in radians
     */
    turn(v) {
        if (this.state != 0 && this.state != 4) return;

        this.orientation += v;
        this.orientation %= 2*Math.PI;

        let norm = Math.sqrt(this.speed[0]**2 + this.speed[1]**2);
        this.speed = [norm*Math.sin(this.orientation), norm*Math.cos(this.orientation)];
    }

    /**
     * If in free flight, accelerates the bee by a given value, keeping the orientation.
     * @param v - acceleration value
     */
    accelerate(v) {
        if (this.state != 0 && this.state != 4) return;

        let norm = Math.max(0, Math.sqrt(this.speed[0]**2 + this.speed[1]**2) + v);
        this.speed = [norm*Math.sin(this.orientation), norm*Math.cos(this.orientation)];
    }

    reset_speed() {
        this.speed = [0, 0];
    }

    /**
     * If above a flower and carrying no pollen, descends to it.
     * @param flower - flower to descend to
     * @param height - height to descend to
     */
    descend(flower, height) {
        if (this.state != 0) return;

        this.targetFlower = flower;
        this.targetY = height;
        this.verticalSpeed = -0.3;

        this.state = 1;
    }

    /**
     * If on a flower, climbs back to free flight.
     */
    climb() {
        if (this.state != 2) return;

        this.targetFlower = null;
        this.targetY = 0;
        this.verticalSpeed = 0.3;

        this.state = 3;
    }

    /**
     * If in free flight and carrying pollen, delivers it to a hive.
     * @param x - x coordinate of the hive
     * @param z - z coordinate of the hive
     * @param hive - hive to deliver the pollen to
     */
    deliver(x, z, hive) {
        if (this.state != 4) return;

        this.targetX = x;
        this.targetZ = z;

        this.targetHive = hive;

        this.speed = [(x - this.x)/100, (z - this.z)/100];

        this.orientation = Math.atan2(this.speed[1], this.speed[0]);

        this.state = 5;
    }

    /**
     * Resets the bee's position, speed and orientation if in free flight.
     */
    reset() {
        if (this.state != 0 && this.state != 4) return;
        this.x = 0;
        this.z = 0;
        this.orientation = 0;
        this.speed = [0, 0];
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.x, this.y, this.z);
        this.scene.rotate(this.orientation, 0, 1, 0);
        this.scene.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);
        
        this.scene.pushMatrix();
        this.scene.translate(0, -this.height/3, -this.height/1.5);
        this.scene.rotate(3*Math.PI/4, -1, 0, 0);
        this.abdomen.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.height/2);
        this.scene.rotate(Math.PI/3, 1, 0, 0);
        this.head.display();
        this.scene.popMatrix();

        if (this.pollen != null) {
            this.scene.pushMatrix();
            this.scene.translate(0, -0.5 - this.height/2, 0);
            this.scene.scale(1/this.scaleFactor, 1/this.scaleFactor, 1/this.scaleFactor);
            this.pollen.display();
            this.scene.popMatrix();
        }

        this.torax.display();
        this.scene.popMatrix();
    }
}
