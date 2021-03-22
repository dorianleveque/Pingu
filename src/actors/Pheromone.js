import { Actor, Penguin, Triggers } from "./index.js"
import { createSphere } from "../Prims.js"
import Component from "./components/Component.js";

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
		this.setTrigger(Triggers.Nimbus, Triggers.Regions.Sphere, { radius: 7, visible: options.triggerVisible }, [Penguin])
	}

	get age() {
		return this.getComponent(PheromoneBehavior).age;
	}
}

class PheromoneBehavior extends Component {

	constructor(actor, options = []) {
		super(actor);
		const [delay] = options;
		this.delay = delay || 1000;
		this.counter = 0;
	}

	update(dt) {
		this.actor.object3d.material.opacity = 1 - this.counter / this.delay;
		if (this.counter >= this.delay) {
			this.actor.sim.removeActor(this.actor);
		}
		this.counter++;
	}

	get age() {
		return this.delay - this.counter;
	}
}