import * as THREE from "../lib/three.module.js";
import Sim from "./Sim.js";

/**
 * Classe Acteur
 * Objet 3d de la scene lié à une scène
 */
export default class Actor {

	/**
	 * @param {Sim} sim simulation
	 */
	constructor(sim, mass = 1, velocityMax = 8, forceMax = 1) {
		this.sim = sim;
		this.objet3d = null;
		this.parent = null;
		this.components = []
		this.velocity = new THREE.Vector3();
		this.acceleration = new THREE.Vector3();
		this.target = new THREE.Vector3();
		this.velocityMax = velocityMax;
		this.forceMax = forceMax;
		this.mass = mass;
		this.nimbus = null;
	}

	/**
	 * Modification de la position de l'acteur
	 * @param {THREE.Vector3} vector vecteur
	 */
	set position(vector) {
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

	update(dt) {
		this.components.forEach(component => component.update(dt));

		this.acceleration.clampLength(0, this.forceMax);
		this.velocity.addScaledVector(this.acceleration, dt);
		this.velocity.clampLength(0, this.velocityMax);
		this.position.addScaledVector(this.velocity, dt);
		this.acceleration.multiplyScalar(0);

		const direction = this.position.clone()
		direction.add(this.velocity)
		this.objet3d.lookAt(direction)
	}

	/**
	 * Return true if actor is outside of the ground
	 */
	isOutOfGround() {
		return this.sim.isOutOfGround(this)
	}

	/**
	 * Apply Specific force to move in direction of this force
	 * @param {Vector3} force 
	 */
	applyForce(force) {
		this.acceleration.addScaledVector(force, 1 / this.mass);
	}

	/**
	 * Add component behavior
	 * @param {ComponentClass} componentClass component class
	 * @param {Object} options options
	 */
	addComponent(componentClass, ...options) {
		this.components.push(new componentClass(this, options));
	}

	/**
	 * Remove component behavior
	 * @param {ComponentClass} componentClass component class
	 */
	removeComponent(componentClass) {
		const component = this.getComponent(componentClass)
		if (component != null) {
			this.components.splice(this.components.indexOf(component), 1);
		}
	}

	/**
	 * get component instance
	 * @param {ComponentClass} componentClass component class
	 */
	getComponent(componentClass) {
		return this.components.find(component => component instanceof componentClass) || null;
	}

	/**
	 * Affectation d'une incarnation à un acteur
	 * @param {THREE.Object3D} obj 
	 */
	setObjet3d(obj) {
		this.objet3d = obj;
		this.sim.scene.add(this.objet3d);
	}

	isInNimbus(act) { // TODO: A finir
		const distance = this.objet3d.position.distanceTo(act.objet3d.position);
		if (act == this.parent || distance >= this.nimbus) {
			return 0;
		}
		return distance / this.nimbus;
	}
}