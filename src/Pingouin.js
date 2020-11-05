import * as THREE from "../lib/three.module.js";
import Acteur from "./Acteur.js"
import Pheromone from "./Pheromone.js"
import { chargerObj } from "./prims.js"
import { getRandCoord } from "./utils.js"

export default class Pingouin extends Acteur {

	constructor(sim, options = {}) {
		super(sim);
		this.vitesse = new THREE.Vector3(0, 0, 0);
		this.acceleration = new THREE.Vector3(0, 0, 0);
		this.cible = new THREE.Vector3(0, 0, 0);
		this.deplacement = new THREE.Vector3();
		this.vitesseMax = 0.1;
		this.forceMax = 0.01;
		this.refVect = new THREE.Vector3(0, 0, 1);
		this.toBeEaten = {};
		this.coordPhephe = [];

		this.setObjet3d(chargerObj("tux1", "assets/obj/pingouin/penguin.obj", "assets/obj/pingouin/penguin.mtl"));
	}

	applyforce(f) {
		this.acceleration.add(f);
	}

	seek(cible, coef) {
		var steer = new THREE.Vector3(0, 0, 0);
		// Code à compléter
		this.applyforce(steer);
	}

	flee(cible, coef) {
		var steer = new THREE.Vector3(0, 0, 0);
		// Code à compléter
		this.applyforce(steer.negate());
	}

	orientation(cible) {
		var dc = Math.sqrt(Math.pow(cible.z - this.objet3d.position.z, 2) + Math.pow(cible.x - this.objet3d.position.x, 2));
		var num = cible.z - this.objet3d.position.z;
		var dirAngle = Math.acos(num / dc);
		return dirAngle;
	}

	creerPheromone() {
		if (Math.random() < 0.02) {
			var x = this.objet3d.position.x;
			var z = this.objet3d.position.z;
			this.coordPhephe.push([x, z]);
			var phephe = new Pheromone(this.sim, this, 3);
			phephe.setPosition(x, 0, z);
			this.sim.addActeur(phephe);
		}
	}

	outOfBound() {
		var pos = this.objet3d.position;
		return pos.x < -50 || pos.x > 50 || pos.z < -50 || pos.z > 50;
	}

	actualiser(dt) {
		var coef = 0;
		this.sim.acteurs.forEach(act => {
			coef = act.isInNimbus(this);
			if (this != act && coef > 0) {

				switch (act.constructor.name) {
					case "Herbe": // Herbe
						if (coef >= 0.1) {
							this.seek(act.objet3d.position, 1 - coef);
						} else {
							this.sim.delActeur(act);
						}
						break;
					case "Humain": // Humain
						if (coef < 0.2) {
							this.flee(act.objet3d.position, 1 - coef);
						}
						break;
					/*case "c":
						var camFeet = act.objet3d.position.clone();
						camFeet.y = 0;
						this.flee(camFeet, 1);
						break;*/
					case "Pingouin":
						if (coef != 0) {
							this.seek(act.objet3d.position, 0.05);
						}
						break;
					default:
						break;
				}
			}
		})

		if (this.acceleration.length() == 0 && (this.outOfBound() || Math.random() < 0.01)) {
			const [x, z] = getRandCoord(-50, 50, -50, 50);
			this.cible.set(x, 0, z);
			this.seek(this.cible, 1);
		}

		this.acceleration.clampLength(0, this.forceMax);
		this.vitesse.add(this.acceleration);
		this.vitesse.clampLength(0, this.vitesseMax);
		this.objet3d.position.add(this.vitesse);
		var pp = this.objet3d.position.clone();
		pp.add(this.vitesse);
		this.objet3d.lookAt(pp);
		this.acceleration.multiplyScalar(0);
		this.creerPheromone();
	}
}
