import * as THREE from "../lib/three.module.js";
import Acteur from "./Acteur.js"
import Sim from "./Sim.js"
import { creerTetrahedre, creerSol, creerSphere, chargerObj } from "./prims.js"
import { random, randomRange } from "./utils.js"

// ======================================================================================================================
// Spécialisation des classes Sim et Acteur pour un projet particulier
// ======================================================================================================================

export default class Appli extends Sim {

	constructor() {
		super();
		this.largeurTerrain = null;
		this.profondeurTerrain = null;
	}

	creerScene(params = {}) {
		const { surface, nbHerbe, nbPingouin, nbRocher } = params;
		this.largeurTerrain = surface.largeur || 100;
		this.profondeurTerrain = surface.profondeur || 100;

		//ajout d'un repère à 3 axes dans la scène
		this.scene.add(new THREE.AxesHelper(3.0));

		// création du sol de la scène
		this.scene.add(creerSol(surface.largeur, surface.profondeur));

		this.placerAleatoirement(nbHerbe, Herbe);
		this.placerAleatoirement(nbPingouin, Pingouin);
		//this.placerAleatoirement(nbRocher, Rocher, this.RocherCreationCallback);

		/*const rocher = new Rocher("rocher", this, { largeur: 3, profondeur: 2, hauteur: 1.5 });
		rocher.setPosition(-5, 0.75, 5);
		this.addActeur(rocher);*/
	}

	/**
	 * Place Aléatoirement sur le terrains plusieurs instance de l'acteur indiqué
	 * @param {Number} nbMax Nombre maximum d'acteur à placer sur le terrain
	 * @param {Class} classe Classe d'acteur à créer et placer
	 * @param {Function} creationCallback Fonction appelée avant la création de l'acteur pour personnaliser ses options ou modifier des options d'orientation
	 */
	placerAleatoirement(nbMax, classe, creationCallback = (classe, index) => { }) {
		for (let i = 0; i < nbMax; i++) {
			const { name, options } = creationCallback(classe, i) || { name: "", options: {} }

			const acteur = new classe(`${name || classe.name}${i}`, this, options || {});

			// le terrain généré est centré
			const dlt = this.largeurTerrain / 2;
			const dpt = this.profondeurTerrain / 2;
			acteur.setPosition(randomRange(-dlt, dlt), 0, randomRange(-dpt, dpt));
			this.addActeur(acteur)
		}
	}

	RocherCreationCallback(classe, index) {
		return {
			options: {
				rayon: randomRange(1, 6),
				detail: random(5)
			}
		}
	}

}

class Herbe extends Acteur {

	constructor(nom, sim, options = {}) {
		super(nom, sim);
		this.setObjet3d(creerSphere(
			options.rayon || 0.25,
			options.couleur || 0x78f03c
		));
	}

}

// La classe décrivant les rochers
// ===============================
class Rocher extends Acteur {

	constructor(nom, sim, options = {}) {
		super(nom, sim);
		this.setObjet3d(creerTetrahedre(
			options.rayon || 0.5,
			options.detail || 0,
			options.couleur
		));
	}
}


// ========================================================================================================

// La classe décrivant des pingouins
// =================================

class Pingouin extends Acteur {

	constructor(nom, sim, options = {}) {
		super(nom, sim);
		this.target = new THREE.Vector3();
		this.vitesse = new THREE.Vector3(1, 0, 0);
		this.deplacement = new THREE.Vector3();
		this.vitesseMax = 1;
		this.setObjet3d(chargerObj("tux1", "assets/obj/pingouin/penguin.obj", "assets/obj/pingouin/penguin.mtl"));
	}

	getSpeedSquared() {
		return this.vitesse.lengthSq();
	}

	actualiser(dt) {
		//const t = this.sim.horloge;
		//const previousPos = this.getPosition();
		/*this.setOrientation(t);
		this.setPosition(previousPos.x + random(0.5), 0.0, previousPos.z + random(0.5));
*/
		//this.target = new THREE.Vector3(random(0.5), 0.0, random(0.5))

		if (this.getSpeedSquared() > (this.vitesseMax * this.vitesseMax)) {
			this.vitesse.normalize();
			this.vitesse.multiplyScalar(this.vitesseMax);
		}

		// calculate displacement
		this.deplacement.copy(this.vitesse).multiplyScalar(dt);

		// calculate target position
		const position = this.getPosition();
		this.target.copy(position).add(this.deplacement);

		// update the orientation if the vehicle has a non zero velocity
		if (this.getSpeedSquared() > 0.00000001) {
			this.lookAt(this.target);
		}

		// update position
		position.copy(this.target);
		this.setPosition(position.x, position.y, position.z);
	}

	lookAt(target) {
		/*targetDirection.subVectors(target, this.getPosition()).normalize();
		this.rotation.lookAt(this.forward, targetDirection, this.up);*/
		return this;

	}
}

