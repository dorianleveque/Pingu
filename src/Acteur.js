import * as THREE from "../lib/three.module.js";
import Sim from "./Sim.js";

/**
 * Classe Acteur
 * Objet 3d de la scene lié à une scène
 */
export default class Acteur {

	/**
	 * @param {Sim} sim simulation
	 */
	constructor(sim) {
		this.objet3d = null;
		this.sim = sim;
	}

	/**
	 * Affectation d'une incarnation à un acteur
	 * @param {THREE.Object3D} obj 
	 */
	setObjet3d(obj) {
		this.objet3d = obj;
		this.sim.scene.add(this.objet3d);
	}

	/**
	 * Modification de la position de l'acteur
	 * @param {THREE.Vector3} vector vecteur
	 */
	set position (vector) {
		if (this.objet3d)
			this.objet3d.position.set(vector.x, vector.y, vector.z);
	}

	/**
	 * Retourne le vecteur position de l'acteur
	 */
	get position() {
		if (this.objet3d)
			return this.objet3d.position;
	}

	/**
	 * Modification de l'orientation de l'acteur
	 * @param {Number} cap 
	 */
	set orientation(cap) {
		if (this.objet3d)
			this.objet3d.rotation.y = cap;
	}

	get orientation() {
		if (this.objet3d)
			return this.objet3d.rotation.y;
	}

	/**
	 * Modification de la visibilité de l'acteur
	 * @param {Boolean} v 
	 */
	set visible(v) {
		if (this.objet3d)
			this.objet3d.visible = v;
	}

	get visible() {
		if (this.objet3d)
			return this.objet3d.visible;
	}

	actualiser(dt) { }

	isInNimbus(act) { // TODO: A finir (le param nimbus n'existe pas)
		const distance = this.objet3d.position.distanceTo(act.objet3d.position);
		const parent = this.parent || null;
		if (act == parent || distance >= this.nimbus) {
			return 0;
		}
		return distance / this.nimbus;
	}
}