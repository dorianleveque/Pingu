import Actor from "./Actor.js"
import { loadObj } from "./prims.js"
import FSM from "./components/FSM.js"
import { Seek, Flee } from "./components/Steering.js";
import Arrive from "./components/Arrive.js";
import RandomTarget from "./components/RandomTarget.js"
import ReleasePheromone from "./components/ReleasePheromone.js"
import ObstacleAvoidance from "./components/ObstacleAvoidance.js";
import { Area, Focus, Nimbus } from "./triggers/Trigger.js";
import RegionTriggerSphere from "./triggers/RegionTriggerSphere.js";
import RegionTriggerAngularArea from "./triggers/RegionTriggerAngularArea.js";
import RegionTriggerCylinder from "./triggers/RegionTriggerCylinder.js"
import Human from "./Human.js";
import Awarness from "./components/Awareness.js";
import Grass from "./Grass.js";

export default class Penguin extends Actor {

	constructor(sim, options = {}) {
		super(sim, options.mass);
		this.setObject3d(loadObj("tux1", "assets/obj/pingouin/penguin.obj", "assets/obj/pingouin/penguin.mtl"));

		this.addComponent(FSM, {
			"wander": {
				"enter": () => this.addComponent(RandomTarget, true),
				"update": () => console.log(this.getComponent(Awarness).get()),
				"exit": () => this.removeComponent(RandomTarget)
			},
			"eat": {
				"update": () => { }
			},
			"flee": {
				"update": () => { }
			}
		}, "wander")
		this.addComponent(Awarness);
		this.addComponent(Seek);
		this.addComponent(Arrive);
		this.addComponent(ReleasePheromone);
		this.addComponent(ObstacleAvoidance);
		this.setTrigger(Nimbus, RegionTriggerSphere, { radius: 4 }, [Penguin]);
		this.setTrigger(Focus, RegionTriggerAngularArea, { radius: 5, height: 3, theta: 5 * Math.PI / 6 });
		this.setTrigger(Area, RegionTriggerCylinder, { radius: 0.7, height: 3 }, [Penguin, Grass])
	}

	onTriggerEnter(type, observed, coef) {
		switch (type) {
			case "Nimbus": this.getComponent(Awarness).addInNimbus(observed, coef); break;
			case "Focus": this.getComponent(Awarness).addInFocus(observed, coef); break;
		}
	}

	onTriggerStay(type, observed, coef) {
		switch (type) {
			case "Nimbus": this.getComponent(Awarness).updateInNimbus(observed, coef); break;
			case "Focus": this.getComponent(Awarness).updateInFocus(observed, coef); break;
		}
	}

	onTriggerExit(type, observed, coef) {
		switch (type) {
			case "Nimbus": this.getComponent(Awarness).removeInNimbus(observed, coef); break;
			case "Focus": this.getComponent(Awarness).removeInFocus(observed, coef); break;
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
