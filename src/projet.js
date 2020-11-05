import * as THREE from "../lib/three.module.js";
import Acteur from "./Acteur.js"
import Sim from "./Sim.js"
import { creerTetrahedre, creerSol, creerSphere, chargerObj } from "./prims.js"
import { random, randomRange, getRandCoord } from "./utils.js"

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


class Pheromone extends Acteur {

	constructor(nom, sim, options = {}) {
		super(nom, sim);
		var rayon = data.rayon || 0.1;
		var couleur = data.couleur || 0x0000ff;
		var opa = data.opacity || 1;

		var sph = creerSphereTransparente(nom, { rayon: rayon, couleur: couleur, opacity: opa });
		this.setObjet3d(sph);

		this.counter = 0;
	}

	actualiser(dt) {
		this.counter = this.counter + 1;
		if (this.counter >= 100 && this.counter <= 150) {
			this.data.nimbus = 2;
			this.objet3d.material.opacity = 0.5;
		}
		else if (this.counter >= 150 && this.counter <= 300) {
			this.data.nimbus = 1;
			this.objet3d.material.opacity = 0.15;
		}
		else if (this.counter >= 300) {
			this.sim.delActeur(this);
		}
	}

}



// ========================================================================================================

// La classe décrivant des pingouins
// =================================

class Pingouin extends Acteur {

	constructor(nom, sim, options = {}) {
		super(nom, sim);
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
			var phephe = new Pheromone("phe" + this.coordPhephe.length, { parent: this, nimbus: 3 }, this.sim);
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
		for (const act of this.sim.acteurs) {
			coef = act.isInNimbus(this);
			if (this != act && coef > 0) {
				switch (act.nom[0]) {
					case "h": // Herbe
						if (coef >= 0.1) {
							this.seek(act.objet3d.position, 1 - coef);
						} else {
							this.sim.delActeur(act);
						}
						break;
					case "t": // Humain
						if (coef < 0.2) {
							this.flee(act.objet3d.position, 1 - coef);
						}
						break;
					case "c":
						var camFeet = act.objet3d.position.clone();
						camFeet.y = 0;
						this.flee(camFeet, 1);
						break;
					case "p":
						if (coef != 0) {
							this.seek(act.objet3d.position, 0.05);
						}
						break;
					default:
						break;
				}
			}
		}

		if (this.acceleration.length() == 0 && (this.outOfBound() || Math.random() < 0.01)) {
			var [x, z] = getRandCoord(-50, 50, -50, 50);
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

