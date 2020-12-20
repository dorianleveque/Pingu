import Actor from "./Actor.js"
import { loadObj } from "./prims.js"
import FSM from "./components/FSM.js"
import {Seek, Flee} from "./components/Steering.js";
import Arrive from "./components/Arrive.js";
import RandomTarget from "./components/RandomTarget.js"
import ReleasePheromone from "./components/ReleasePheromone.js"

export default class Penguin extends Actor {

	constructor(sim, options = {}) {
		super(sim, options.mass);

		this.setObjet3d(loadObj("tux1", "assets/obj/pingouin/penguin.obj", "assets/obj/pingouin/penguin.mtl"));
		this.addComponent(FSM, {
			"wander": {
				"update": (dt) => {}
			},
			"eat": {
				"update": () => {}
			},
			"flee": {
				"update": () => {}
			}
		}, "wander")
		this.addComponent(RandomTarget);
		this.addComponent(Seek)
		this.addComponent(Arrive)
		this.addComponent(ReleasePheromone)
	}

	/*update(dt) {
		var coef = 0;
		this.sim.actors.forEach(act => {
			coef = act.isInNimbus(this);
			if (this != act && coef > 0) {

				switch (act.constructor.name) {
					case "Herbe": // Herbe
						console.log("yolo")
						console.log("AYA ! ");
						if (coef >= 0.1) {

							this.seek(act.position, 1 - coef);
						} else {
							console.log("Delele acteur: ", act);
							this.sim.removeActeur(act);
							console.log(act);
						}
						break;
					case "Humain": // Humain
						if (coef < 0.2) {
							this.flee(act.position, 1 - coef);
						}
						break;
					/*case "c":
						var camFeet = act.objet3d.position.clone();
						camFeet.y = 0;
						this.flee(camFeet, 1);
						break;*/
					/*case "Pingouin":
						if (coef != 0) {
							this.seek(act.objet3d.position, 0.05);
						}
						break;
					default:
						break;
				}
			}
		})
		*/
}
