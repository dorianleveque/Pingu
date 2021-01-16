
import * as THREE from "../lib/three.module.js";
import Sim from "./Sim.js";
import { Human, Grass, Rock, Penguin, BabyPenguin } from "./actors/index.js"
import { createPlane } from "./Prims.js"
import { random, randomRange, getRandCoord } from "./Utils.js"

// ======================================================================================================================
// Spécification of Sim and Actor classes for a specific project
// ======================================================================================================================

// give for each object in JavaScript a unique id
(function () {
	if (typeof Object.id == "undefined") {
		var id = 0;

		Object.id = function (o) {
			if (typeof o.__uniqueid == "undefined") {
				Object.defineProperty(o, "__uniqueid", {
					value: ++id,
					enumerable: false,
					// This could go either way, depending on your 
					// interpretation of what an "id" is
					writable: false
				});
			}
			return o.__uniqueid;
		};
	}
})();

export default class App extends Sim {

	constructor() {
		super();
		this.groundWidth = 0;
		this.groundDepth = 0;
	}

	createScene(params = {}) {
		const { ground, grassCount, penguinCount, babyPenguinCount, rockCount } = params;

		this.groundWidth = ground.width || 100;
		this.groundDepth = ground.depth || 100;

		//add a 3-axis marker in the scene
		this.scene.add(new THREE.AxesHelper(3.0));

		// ground creation
		this.scene.add(createPlane(this.groundWidth, this.groundDepth));

		// character creation
		this.placeRandomly(1, Human);

		// place elements on the scene
		this.placeRandomly(grassCount, Grass);
		this.placeRandomly(penguinCount, Penguin, this.PenguinCreationCallback);
		this.placeRandomly(babyPenguinCount, BabyPenguin, this.PenguinCreationCallback);
		this.placeRandomly(rockCount, Rock, this.RockCreationCallback);
	}

	/**
	 * Check if actor is out of the ground
	 * @param {Actor} actor
	 */
	isOutOfGround(actor) {
		const pos = actor.position;
		return pos.x < -this.groundWidth / 2 || pos.x > this.groundWidth / 2 || pos.z < -this.groundDepth / 2 || pos.z > this.groundDepth / 2;
	}

	/**
	 * Place Aléatoirement sur le terrains plusieurs instance de l'actor indiqué
	 * @param {Number} count Nombre maximum d'actor à placer sur le terrain
	 * @param {Class} classe Classe d'actor à créer et placer
	 * @param {Function} creationCallback Fonction appelée avant la création de l'actor pour personnaliser ses options ou modifier des options d'orientation
	 */
	placeRandomly(count, classe, creationCallback = (classe, index) => { }) {
		for (let i = 0; i < count; i++) {
			const options = creationCallback(classe, i) || {}
			const actor = new classe(this, options);

			// le terrain généré est centré
			const dlt = this.groundWidth / 2;
			const dpt = this.groundDepth / 2;
			const [x, z] = getRandCoord(-dlt, dlt, -dpt, dpt);
			actor.position = new THREE.Vector3(x, 0, z);
			this.addActor(actor)
		}
	}

	RockCreationCallback(classe, index) {
		return {
			radius: randomRange(0.5, 1),
			detail: Math.ceil(randomRange(1, 3))
		}
	}

	PenguinCreationCallback(classe, index) {
		return {
			mass: (classe == Penguin) ? randomRange(12, 24) : randomRange(2, 8) 
		}
	}

}




