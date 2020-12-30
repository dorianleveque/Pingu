import Actor from "./Actor.js"
import Penguin from "./Penguin.js";
import { createSphere } from "./prims.js"
import RegionTriggerSphere from "./triggers/RegionTriggerSphere.js";
import { Area, Nimbus } from "./triggers/Trigger.js";

export default class Grass extends Actor {

	constructor(sim, options = {}) {
		super(sim);
		this.setObject3d(createSphere(
			options.radius || 0.25,
			options.widthSegments || 15,
			options.heightSegments || 15,
			options.color || 0x056e00
		));
		this.setTrigger(Nimbus, RegionTriggerSphere, { radius: 2 })
		this.setTrigger(Area, RegionTriggerSphere, { radius: options.radius || 0.25 }, [Penguin])
	}
}
