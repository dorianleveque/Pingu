import Actor from "./Actor.js"
import { createSphere } from "./prims.js"
import Component from "./components/Component.js"

export default class Pheromone extends Actor {

	constructor(sim, parent, options = {}) {
		super(sim);
		this.parent = parent;
		this.setObjet3d(createSphere(
			options.rayon || 0.1,
			options.couleur || 0x0000ff,
			options.opacity || 1
		));
		this.addComponent(PheromoneBehavior)
	}
}

class PheromoneBehavior extends Component {

  constructor(actor, options = []) {
		super(actor);
    this.counter = 0;
  }

  update(dt) {
		if (this.counter >= 100 && this.counter <= 150) {
			this.actor.objet3d.material.opacity = 0.5;
		}
		else if (this.counter >= 150 && this.counter <= 300) {
			this.actor.objet3d.material.opacity = 0.15;
		}
		else if (this.counter >= 300) {
			this.actor.sim.removeActor(this.actor);
		}
		this.counter++;
  }
}