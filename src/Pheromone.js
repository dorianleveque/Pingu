import Acteur from "./Acteur.js"
import { creerSphere } from "./prims.js"

export default class Pheromone extends Acteur {

	constructor(sim, parent, nimbus = 3, options = {}) {
		super(sim);
		this.parent = parent;
		this.nimbus = nimbus;
		this.setObjet3d(creerSphere(
			options.rayon || 0.1,
			options.couleur || 0x0000ff,
			options.opacity || 1
		));

		this.counter = 0;
	}

	actualiser(dt) {
		this.counter = this.counter + 1;
		if (this.counter >= 100 && this.counter <= 150) {
			this.nimbus = 2;
			this.objet3d.material.opacity = 0.5;
		}
		else if (this.counter >= 150 && this.counter <= 300) {
			this.nimbus = 1;
			this.objet3d.material.opacity = 0.15;
		}
		else if (this.counter >= 300) {
			this.sim.delActeur(this);
		}
	}

}