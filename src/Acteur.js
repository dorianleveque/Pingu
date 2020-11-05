import * as THREE from "../lib/three.module.js";
import Sim from "./Sim.js";

/**
 * Classe Acteur
 * Objet 3d de la scene lié à une scène
 */
class Acteur {

	/**
	 * 
	 * @param {String} nom nom de l'acteur
	 * @param {Sim} sim simulation
	 */
	constructor(nom, sim) {
		this.nom = nom;
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
	 * @param {Number} x coordonnée x
	 * @param {Number} y coordonnée y
	 * @param {Number} z coordonnée z
	 */
	setPosition(x, y, z) {
		if (this.objet3d)
			this.objet3d.position.set(x, y, z);
	}

	/**
	 * Retourne la position de l'Acteur
	 * @return THREE.Vector3
	 */
	getPosition() {
		if (this.objet3d)
			return this.objet3d.position;
	}

	/**
	 * Modification de l'orientation de l'acteur
	 * @param {*} cap 
	 */
	setOrientation(cap) {
		if (this.objet3d)
			this.objet3d.rotation.y = cap;
	}

	getOrientation() {
		if (this.objet3d)
			return this.objet3d.rotation.y;
	}

	/**
	 * Modification de la visibilité de l'acteur
	 * @param {*} v 
	 */
	setVisible(v) {
		if (this.objet3d)
			this.objet3d.isVisible = v;
	}

	isVisible() {
		if (this.objet3d)
			return this.objet3d.isVisible;
	}

	actualiser(dt) { }

	isInNimbus(act) {
		const distance = this.objet3d.position.distanceTo(act.objet3d.position);
		const parent = this.parent || null;
		if (act == parent || distance >= this.nimbus) {
			return 0;
		}
		return distance / this.nimbus;
	}
}

export default Acteur;
