import Actor from "./Actor.js"
import Grass from "./Grass.js";
import { createTetrahedre } from "./prims.js"

export default class Rock extends Actor {

	constructor(sim, options = {}) {
		super(sim);
		this.setObject3d(createTetrahedre(
			options.radius || 0.5,
			options.detail || 0,
			options.color || 0x4d4d4d
		));
	}
}