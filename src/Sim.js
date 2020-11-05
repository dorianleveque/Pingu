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
		this.acteurs = [];

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

		this.creerScene(params);

		this.chrono = new THREE.Clock();
		this.chrono.start();
	}

	/**
	 * Méthode de création du contenu du monde : à surcharger
	 * @param {Object} params 
	 */
	creerScene(params) {
		throw new Error('You have to implement the method creerScene!');
	}

	/**
	 * Boucle de simulation
	 */
	actualiser() {
		const dt = this.chrono.getDelta();
		this.horloge += dt;

		// Modification de la caméra virtuelle
		// ===================================
		//this.controleur.update(dt);

		// Boucle ACTION
		// =============
		this.acteurs.forEach(acteur => acteur.actualiser(dt));

		//this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(() => this.actualiser());
	}

	addActeur(acteur) {
		this.acteurs.push(acteur);
	}

	findActeur(acteur) {
		return this.acteurs.find(act => act == acteur) || null;
	}

	delActeur(acteur) {
		const a = this.findActeur(acteur)
		if (a != null) {
			this.scene.remove(acteur.objet3d);
			this.acteurs.splice(this.acteurs.indexOf(a), 1);
		}
	}

}