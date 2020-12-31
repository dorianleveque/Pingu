import { Actor, Penguin, Triggers } from "./index.js"
import { createSphere } from "../Prims.js"

export default class Grass extends Actor {

	constructor(sim, options = {}) {
		super(sim);
		this.setObject3d(createSphere(
			options.radius || 0.25,
			options.widthSegments || 15,
			options.heightSegments || 15,
			options.color || 0x056e00
		));
		this.setTrigger(Triggers.Nimbus, Triggers.Regions.Sphere, { radius: 2 })
		this.setTrigger(Triggers.Area, Triggers.Regions.Sphere, { radius: options.radius || 0.25 }, [Penguin])
	}
}
