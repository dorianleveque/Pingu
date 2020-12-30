import Actor from "./Actor.js"
import { createSphere } from "./prims.js"
import Component from "./components/Component.js"
import { Nimbus } from "./triggers/Trigger.js";
import RegionTriggerSphere from "./triggers/RegionTriggerSphere.js";
import Penguin from "./Penguin.js";

export default class Pheromone extends Actor {

	constructor(sim, parent, options = {}) {
		super(sim);
		this.parent = parent;
		this.setObject3d(createSphere(
			options.radius || 0.1,
			3, 3,
			options.color || 0x0000ff,
			options.opacity || 1
		));
		this.addComponent(PheromoneBehavior, options.delay)
		this.setTrigger(Nimbus, RegionTriggerSphere, { radius: 2 }, [Penguin])
	}
}

class PheromoneBehavior extends Component {

	constructor(actor, options = []) {
		super(actor);
		const [delay] = options;
		this.delay = delay || 500;
		this.counter = 0;
	}

	update(dt) {
		this.actor.object3d.material.opacity = 1 - this.counter / this.delay;
		if (this.counter >= this.delay) {
			this.actor.sim.removeActor(this.actor);
		}
		this.counter++;
	}
}