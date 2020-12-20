import * as THREE from "../lib/three.module.js";

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

		// Modification de la caméra virtuelle
		// ===================================
		//this.controleur.update(dt);

		// Boucle ACTION
		// =============
		this.actors.forEach(actor => actor.update(dt));

		//this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(() => this.update());
	}

	addActor(actor) {
		this.actors.push(actor);
	}

	findActor(actor) {
		return this.actors.find(act => act == actor) || null;
	}

	removeActor(actor) {
		const a = this.findActor(actor)
		if (a != null) {
			this.scene.remove(actor.objet3d);
			this.actors.splice(this.actors.indexOf(a), 1);
		}
	}

}