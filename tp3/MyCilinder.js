import {CGFobject} from '../lib/CGF.js';
/**
 * MyCilinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices 
 * @param stacks 
 */
export class MyCilinder extends CGFobject {
	constructor(scene, slices, stacks) {
		super(scene);

		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	}
	
	get_vertices(slices, stacks){
		let height = 1/stacks
		for(var k = 0; k < stacks; k++){
			for(var i = 0; i < slices; i++){
				this.vertices.push(Math.cos(i*2*Math.PI/slices), Math.sin(i*2*Math.PI/slices), k*height);
				this.vertices.push(Math.cos(i*2*Math.PI/slices), Math.sin(i*2*Math.PI/slices), (k+1)*height);
			}

			for(var i = 0; i < slices; i++){
				this.indices.push(i*2 + k*2*slices, i*2+2 + k*2*slices, i*2+3 + k*2*slices)
				this.indices.push(i*2+3 + k*2*slices, i*2+1 + k*2*slices, i*2 + k*2*slices)
			}

			for(var i = 0; i < slices; i++){
				for(var j = 0; j < 2; j++)
					this.normals.push(Math.cos(i*2*Math.PI/slices), Math.sin(i*2*Math.PI/slices), 0)
			}
		}
		this.vertices.push(Math.cos(slices*2*Math.PI/slices), Math.sin(slices*2*Math.PI/slices), stacks*height);
		this.vertices.push(Math.cos((slices-1)*2*Math.PI/slices), Math.sin((slices-1)*2*Math.PI/slices), stacks*height);
	}

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.get_vertices(this.slices, this.stacks);

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}

	updateBuffers() {}
}

