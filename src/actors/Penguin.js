import { Actor, Human, Grass, Components, Triggers, Pheromone } from "./index.js"
import { loadObj } from "../Prims.js"
import { randomRange } from "../Utils.js";

export default class Penguin extends Actor {

	constructor(sim, options = {}) {
		super(sim, options.mass);
		this.setObject3d(loadObj("tux1", "assets/obj/pingouin/penguin.obj", "assets/obj/pingouin/penguin.mtl"));
		this.InArea = [];
		this.InFocus = [];

		// Penguin Components
		this.addComponent(Components.Awareness);
		this.addComponent(Components.ReleasePheromone);
		this.addComponent(Components.Hunger);
		this.addComponent(Components.ObstacleAvoidance, this.InFocus);
		this.addComponent(Components.FSM, {
			"Wander": {
				"enter": () => {
					this.addComponent(Components.RandomTarget);
					this.addComponent(Components.Arrive);
					this.addComponent(Components.Seek);
				},
				"update": () => {
					// human
					this.actionWhenHumanAround();

					// hungry
					this.actionWhenHungry();

					// pheromone
					this.actionWhenPheromoneAround();

					// penguin
					if (Math.random() < 0.01) this.actionWhenPenguinAround();
				},
				"exit": () => {
					this.removeComponent(Components.RandomTarget);
					this.removeComponent(Components.Arrive);
					this.removeComponent(Components.Seek);
				},
			},
			"SearchFood": {
				"enter": () => {
					this.addComponent(Components.Seek, 0.2);
					this.addComponent(Components.Arrive);
					this.addComponent(Components.RandomTarget);
				},
				"update": () => {
					// check human
					this.actionWhenHumanAround();

					// search grass
					const grass = this.isThereAround(Grass, 0.66);
					if (grass) this.target = grass.position;
					if (this.InArea.find(e => e == grass)) {
						setTimeout(this.eatAction.bind(this), randomRange(500, 1000), grass);
						this.getComponent(Components.FSM).transition("Stop");
					}
				},
				"exit": () => {
					this.removeComponent(Components.RandomTarget);
					this.removeComponent(Components.Arrive);
					this.removeComponent(Components.Seek);
				}
			},
			"FollowPheromone": {
				"enter": () => {
					this.addComponent(Components.Seek);
					this.addComponent(Components.Arrive);
				},
				"update": () => {
					// check human
					this.actionWhenHumanAround();

					// check if a penguin is near
					this.actionWhenPenguinAround();

					// hungry
					this.actionWhenHungry();
					
					// stop near a penguin
					if (this.InArea.find(e => e instanceof Penguin)) {
						this.getComponent(Components.FSM).transition("Stop");
					}
					else {
						// search the farthest pheromone and go there
						const pheromone = this.getComponent(Components.Awareness).getAll()
							.filter(e => e.actor instanceof Pheromone)
							.sort((a, b) => b.actor.age - a.actor.age)[0] || null;
						if (pheromone) this.target = pheromone.actor.position;
					}

				},
				"exit": () => {
					this.removeComponent(Components.Arrive);
					this.removeComponent(Components.Seek);
				}
			},
			"GoToPenguin": {
				"enter": () => {
					this.addComponent(Components.Seek);
					this.addComponent(Components.Arrive);
				},
				"update": () => {
					// check human
					this.actionWhenHumanAround();

					// hungry
					this.actionWhenHungry();

					// stop near a penguin
					if (this.InArea.find(e => e instanceof Penguin)) {
						this.getComponent(Components.FSM).transition("Stop")
					}
				},
				"exit": () => {
					this.removeComponent(Components.Arrive);
					this.removeComponent(Components.Seek);
				}
			},
			"Stop": {
				"enter": () => {
					this.addComponent(Components.Seek);
					this.addComponent(Components.Arrive);
					setTimeout(this.stopAction.bind(this), randomRange(1000, 3000));
				},
				"update": () => {
					// check human
					this.actionWhenHumanAround();

					if (this.InArea.find(e => e instanceof Penguin)) {
						this.addComponent(Components.Arrive, 10, 1.5);
					}
				},
				"exit": () => {
					this.removeComponent(Components.Arrive);
					clearTimeout(this.stopAction);
					clearTimeout(this.eatAction);
				}
			},
			"Flee": {
				"enter": () => {
					this.forceMax = 100; // give an helping hand to to go quickly
					this.addComponent(Components.AbruptDeparture);
					this.addComponent(Components.Flee);
				},
				"update": () => {
					const human = this.isThereAround(Human, 0);
					if (human == null) this.getComponent(Components.FSM).transition("Wander");
					else this.InArea.filter(actor => actor instanceof Penguin).forEach(penguin => {
						penguin.target = human.position;
						penguin.getComponent(Components.FSM).transition("Flee");
					})
				},
				"exit": () => {
					this.forceMax = 50;
					this.removeComponent(Components.Flee);
					this.removeComponent(Components.AbruptDeparture);
				}
			}
		}, "Wander")

		// Trigger
		this.setTrigger(Triggers.Nimbus, Triggers.Regions.Sphere, { radius: 6 }, [Penguin]);
		this.setTrigger(Triggers.Focus, Triggers.Regions.AngularArea, { radius: 8, height: 3, theta: 9 * Math.PI / 10 });
		this.setTrigger(Triggers.Area, Triggers.Regions.Cylinder, { radius: 1, height: 3 }, [Penguin, Grass]);
	}

	// Triggers Event
	onTriggerEnter(type, observed, coef) {
		if (this.isPheromoneOfOthers(observed)) {
			switch (type) {
				case "Nimbus": this.getComponent(Components.Awareness).addInNimbus(observed, coef); break;
				case "Focus": this.getComponent(Components.Awareness).addInFocus(observed, coef); this.InFocus.push(observed); break;
				case "Area": this.InArea.push(observed); break;
			}
		}
	}

	onTriggerStay(type, observed, coef) {
		if (this.isPheromoneOfOthers(observed)) {
			switch (type) {
				case "Nimbus": this.getComponent(Components.Awareness).updateInNimbus(observed, coef); break;
				case "Focus": this.getComponent(Components.Awareness).updateInFocus(observed, coef); break;
			}
		}
	}

	onTriggerExit(type, observed, coef) {
		if (this.isPheromoneOfOthers(observed)) {
			switch (type) {
				case "Nimbus": this.getComponent(Components.Awareness).removeInNimbus(observed, coef); break;
				case "Focus": this.getComponent(Components.Awareness).removeInFocus(observed, coef); this.InFocus.splice(this.InFocus.indexOf(observed), 1); break;
				case "Area": this.InArea.splice(this.InArea.indexOf(observed), 1); break;
			}
		}
	}

	stopAction() {
		this.getComponent(Components.FSM).transition("Wander");
	}

	eatAction(target) {
		this.sim.removeActor(target);
		this.getComponent(Components.Hunger).hasEaten();
	}

	isPheromoneOfOthers(observed) {
		return observed.parent == null || observed.parent != this;
	}

	isThereAround(actorType, rate) {
		const awaHuman = this.getComponent(Components.Awareness).getNearest(actorType)
		return (awaHuman != null && awaHuman.awareness >= rate) ? awaHuman.actor : null;
	}

	actionWhenHumanAround() {
		const human = this.isThereAround(Human, 0.5);
		if (human) {
			this.target = human.position;
			this.getComponent(Components.FSM).transition("Flee");
		}
	}

	actionWhenHungry() {
		if (this.getComponent(Components.Hunger).isHungry()) {
			this.getComponent(Components.FSM).transition("SearchFood");
		}
	}

	actionWhenPheromoneAround() {
		const pheromone = this.isThereAround(Pheromone, 0.2)
		if (pheromone) {
			this.target = pheromone.position;
			this.getComponent(Components.FSM).transition("FollowPheromone");
		}
	}

	actionWhenPenguinAround() {
		const penguin = this.isThereAround(Penguin, 0.66)
		if (penguin) {
			this.target = penguin.position;
			this.getComponent(Components.FSM).transition("GoToPenguin");
		}
	}
}
