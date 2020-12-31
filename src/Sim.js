import * as THREE from "../lib/three.module.js";
import { Actor, Triggers } from "./actors/index.js";

/**
 * Classe Sim
 * Une instance de Sim fait évoluer l'état des instances de la classe Acteur 
 * et les restitue
 */
export default class Sim {

	constructor() {
		this.renderer = null;
		this.scene = null;
		this.horloge = 0.0;
		this.chrono = null;
		this.actors = [];
		this.triggers = [];

		this.textureLoader = new THREE.TextureLoader();
	}

	init(params) {
		params = params || {};

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);

		this.scene = new THREE.Scene();

		this.scene.add(new THREE.AmbientLight(0xffffff, 1.0));
		this.scene.add(new THREE.GridHelper(100, 20));

		this.createScene(params);

		this.chrono = new THREE.Clock();
		this.chrono.start();
	}

	/**
	 * Méthode de création du contenu du monde : à surcharger
	 * @param {Object} params 
	 */
	createScene(params) {
		throw new Error('You have to implement the method createScene!');
	}

	/**
	 * Boucle de simulation
	 */
	update() {
		const dt = this.chrono.getDelta();
		this.horloge += dt;

		// Boucle ACTION
		// =============
		this.triggers.forEach(trigger => trigger.eval());
		this.actors.forEach(actor => actor.update(dt));

		requestAnimationFrame(() => this.update());
	}

	addActor(actor) {
		if (actor instanceof Actor) {
			this.actors.push(actor);
		}
		else throw new Error("The actor passed in parameter isn't a actor class")
	}

	findActor(actor) {
		return this.actors.find(act => act === actor) || null;
	}

	removeActor(actor) {
		const a = this.findActor(actor)
		if (a != null) {
			a.getTrigger().forEach(trig => this.removeTrigger(trig));
			this.scene.remove(actor.object3d);
			this.actors.splice(this.actors.indexOf(a), 1);
		}
	}

	addTrigger(trigger) {
		if (trigger instanceof Triggers.Trigger)
			this.triggers.push(trigger);
	}

	findTrigger(trigger) {
		return this.triggers.find(trig => trig === trigger) || null;
	}

	removeTrigger(trigger) {
		const trig = this.findTrigger(trigger)
		if (trig != null) {
			this.triggers.splice(this.triggers.indexOf(trig), 1);
		}
	}

}