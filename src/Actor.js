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
		this.object3d = null;
		this.components = []
		this.velocity = new THREE.Vector3();
		this.acceleration = new THREE.Vector3();
		this.target = new THREE.Vector3();
		this.velocityMax = velocityMax;
		this.forceMax = forceMax;
		this.mass = mass;
		this.trigger = {}
	}

	/**
	 * Modification de la position de l'acteur
	 * @param {THREE.Vector3} vector vecteur
	 */
	set position(vector) {
		if (this.object3d)
			this.object3d.position.set(vector.x, vector.y, vector.z);
	}

	/**
	 * Retourne le vecteur position de l'acteur
	 */
	get position() {
		if (this.object3d)
			return this.object3d.position;
	}

	/**
	 * Modification de l'orientation de l'acteur
	 * @param {Number} cap 
	 */
	set orientation(cap) {
		if (this.object3d)
			this.object3d.rotation.y = cap;
	}

	get orientation() {
		if (this.object3d)
			return this.object3d.rotation.y;
	}

	/**
	 * Modification de la visibilité de l'acteur
	 * @param {Boolean} v 
	 */
	set visible(v) {
		if (this.object3d)
			this.object3d.visible = v;
	}

	get visible() {
		if (this.object3d)
			return this.object3d.visible;
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
		this.object3d.lookAt(direction)
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
	setObject3d(obj) {
		this.object3d = obj;
		this.sim.scene.add(this.object3d);
	}

	/**
	 * 
	 * @param {TriggerClass} triggerType Trigger class
	 * @param {RegionClass} regionClass 
	 * @param {Object} regionOptions 
	 * @param {ActorClass} observedFilter
	 * @returns Trigger
	 */
	setTrigger(triggerType, regionClass, regionOptions = {}, observedFilter = []) {
		// check if a trigger of this type is already set for this actor
		if (this.trigger.hasOwnProperty(triggerType)) {
			this.sim.removeTrigger(this.trigger[triggerType]);
		}
		else {
			const newTrigger = new triggerType(this, regionClass, regionOptions, observedFilter);
			this.sim.addTrigger(newTrigger);
			this.trigger[triggerType] = newTrigger;
		}
	}

	getTrigger(triggerType = null) {
		return (triggerType) ? this.trigger[triggerType] || null : Object.values(this.trigger);
	}

	/**
	 * Event executed when an actor enter inside of the trigger area.
	 * Can be redefinded
	 * @param {String} triggerType type of trigger
	 * @param {Actor} observed actor observed
	 * @param {Number} coef more the value is close to 1, more the observed actor is close to the centre of the trigger
	 */
	onTriggerEnter(triggerType, observed, coef) {

	}

	/**
	 * Event executed when an actor is inside of the trigger area.
	 * Can be redefinded
	 * @param {String} triggerType type of trigger
	 * @param {Actor} observed actor observed
	 * @param {Number} coef more the value is close to 1, more the observed actor is close to the centre of the trigger
	 */
	onTriggerStay(triggerType, observed, coef) {

	}

	/**
	 * Event executed when an actor exit the trigger area.
	 * Can be redefinded
	 * @param {String} triggerType type of trigger
	 * @param {Actor} observed actor observed
	 * @param {Number} coef more the value is close to 1, more the observed actor is close to the centre of the trigger
	 */
	onTriggerExit(triggerType, observed, coef) {

	}
}