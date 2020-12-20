import Actor from "./Actor.js"
import Pheromone from "./Pheromone.js"
import { loadObj } from "./prims.js"
import { getRandCoord } from "./utils.js"
import FSM from "./components/FSM.js"
import {Seek, Flee} from "./components/Steering.js";
import Arrive from "./components/Arrive.js";

export default class Penguin extends Actor {

	constructor(sim, options = {}) {
		super(sim, options.mass);

		this.setObjet3d(loadObj("tux1", "assets/obj/pingouin/penguin.obj", "assets/obj/pingouin/penguin.mtl"));
		this.addComponent(FSM, {
			"wander": {
				"update": (dt) => {
					if (Math.round(this.velocity.length() * 100) == 0 || this.isOutOfGround()) {
						const [x, z] = getRandCoord(-50, 50, -50, 50);
						this.target.set(x, 0, z);
						//console.log(`new target ${x} ${z}`)
					}
					/*if (this.acceleration.length()==0 && (this.isOutOfGround() || Math.random()<0.01)) {
						const [x, z] = getRandCoord(-50, 50, -50, 50);
						this.target.set(x, 0, z);
					}*/

					//if (Math.round(this.velocity.length()) < 0.1) console.log(`penguin position ${this.position.x} ${this.position.y} ${this.position.z}`)
					this.createPheromone();
				}
			},
			"eat": {
				"update": () => {}
			},
			"flee": {
				"update": () => {}
			}
		}, "wander")
		this.addComponent(Seek)
		this.addComponent(Arrive)
	}

	createPheromone() {
		if (Math.random() < 0.02) {
			const pheromone = new Pheromone(this.sim, this);
			pheromone.position = this.position;
			this.sim.addActor(pheromone);
		}
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
