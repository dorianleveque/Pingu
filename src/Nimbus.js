/**
 * Contient la classe Nimbus et ses dérivées
 */

import * as THREE from "../lib/three.module.js";
import Acteur from "./Acteur.js"

export default class Nimbus {

    constructor(acteur) {
        if (this.constructor === Nimbus) {
            throw new TypeError('Abstract class "Nimbus" cannot be instantiated directly');
        }
        this.parent = acteur;
    }

    /**
     * Renvoie true si l'acteur est dans le nimbus du parent. Sinon false.
     * @abstract
     * @param {Acteur} actor
     */
    isIn(actor) {
        throw new Error('You must implement this function');
    }
}

export default class Nimbus_sphere extends Nimbus {
    constructor(acteur, rayon_sphere) {
        super(acteur);
        this.rayon = rayon_sphere;
    }

    /**
     * @override
     * @param {Acteur} actor 
     */
    isIn(actor) {
        return (this.parent.objet3d.position.distanceToSquared(actor.objet3d.position)) < Math.pow(this.rayon, 2);
    }
}

/**
 * Cylindre de hauteur infinie.
 * La zone de detection est donc un disque en 2D
 */
export default class Nimbus_cylindre extends Nimbus {
    constructor(acteur, rayon_cylindre) {
        super(acteur);
        this.rayon = rayon_cylindre;
    }

    /**
     * @override
     * @param {Acteur} actor 
     */
    isIn(actor) {
        xyzParent = this.parent.objet3d.position;
        xyzActeur = actor.objet3d.position;
        return (Math.pow(xyzActeur.x - xyzParent.x, 2) + Math.pow(xyzActeur.z - xyzParent.z, 2)) < Math.pow(this.rayon, 2);
    }
}

export default class Nimbus_cone extends Nimbus {
    constructor(acteur, rayon_cone, hauteur_cone) {
        super(acteur);
        this.rayon = rayon_cone;
        this.hauteur = hauteur_cone;
    }

    isIn(actor) {
        throw new Error('Not yet implemented');
    }
}