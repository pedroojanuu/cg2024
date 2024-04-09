import {CGFobject} from '../lib/CGF.js';
/**
 * MyPetal
 * @constructor
 * @param scene - Reference to MyScene object
 * @param radius
 */
export class MyPetal extends CGFobject {
	constructor(scene, radius) {
		super(scene);
		this.radius = radius;
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			-1, 0, 0,	//0
			0, -this.radius, 0,	//1
			0, this.radius, 0,	//2
			1, 0, 0,	//3
			-1, 0, 0,	//4
			0, -this.radius, 0,	//5
			0, this.radius, 0,	//6
			1, 0, 0,	//7
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			1, 3, 2,
			5, 4, 6,
			6, 7, 5
		];

		this.normals = [
			0, 0, 1,	//0
			0, 0, 1,	//1
			0, 0, 1,	//2
			0, 0, 1,	//3

			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
		]

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

