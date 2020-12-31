import * as THREE from "../lib/three.module.js";
import { MTLLoader } from "../lib/MTLLoader.js"
import { OBJLoader } from "../lib/OBJLoader.js"

// ======================================================================================================================
// Fonctions utilitaires pour créer des objets graphiques 3d spécifiques aux projets à développer
// ======================================================================================================================

/**
 * Créer un sol
 * @param {Number} width Largeur de la scene
 * @param {Number} height Hauteur de la scene
 * @param {Number} color Couleur de la scene
 * @param {Number} opacity Opacite de la scene
 * @param {Boolean} wireframe Afficher en filament la scene
 */
export function createPlane(width, height, color = 0xaaaaaa, opacity = 1, wireframe = false) {
	const geo = new THREE.PlaneGeometry(width, height);
	const mat = new THREE.MeshLambertMaterial({ color, transparent: true, opacity, wireframe });
	const mesh = new THREE.Mesh(geo, mat);
	mesh.rotation.x = -Math.PI / 2.0;
	return mesh;
}

/**
 * Créer une boite
 * @param {Number} width Largeur de la boite
 * @param {Number} height Hauteur de la boite
 * @param {Number} depth Profondeur de la boite
 * @param {Number} color Couleur de la boite
 * @param {Number} opacity Opacite de la boite
 * @param {Boolean} wireframe Afficher en filament la boite
 */
export function createBox(width, height, depth, color = 0xffaaaa, opacity = 1, wireframe = false) {
	const geo = new THREE.BoxGeometry(width, height, depth);
	const mat = new THREE.MeshLambertMaterial({ color, transparent: true, opacity, wireframe });
	return new THREE.Mesh(geo, mat);
}

/**
 * Creer un tetrahedre
 * @param {Number} radius Rayon du tetrahedre
 * @param {Number} detail Nombre de polygone
 * @param {Number} color Couleur du tetrahedre
 * @param {Number} opacity Opacite du tetrahedre
 * @param {Boolean} wireframe Afficher en filament le tetrahedre
 */
export function createTetrahedre(radius, detail, color = 0xffaaaa, opacity = 1, wireframe = false) {
	const geo = new THREE.TetrahedronGeometry(radius, detail);
	const mat = new THREE.MeshLambertMaterial({ color, transparent: true, opacity, wireframe });
	return new THREE.Mesh(geo, mat);
}

/**
 * Creer une sphere
 * @param {Number} radius Rayon de la sphere
 * @param {Number} widthSegments nombres de segments en largeur
 * @param {Number} heightSegments nombres de segments en hauteur
 * @param {Number} color Couleur de la sphère
 * @param {Number} opacity Opacite de la sphere
 * @param {Boolean} wireframe Afficher en filament de la sphere
 */
export function createSphere(radius, widthSegments, heightSegments, color, opacity = 1, wireframe = false) {
	const geo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
	const mat = new THREE.MeshLambertMaterial({ color, transparent: true, opacity, wireframe });
	return new THREE.Mesh(geo, mat);
}

/**
 * Creer un cylindre
 * @param {Number} radius Rayon du cylindre
 * @param {Number} height Hauteur du cylindre
 * @param {Number} radialSegments Nombre de segments 
 * @param {Number} heightSegments Hauteur des segments
 * @param {Number} openEnded Ouvrir le cylindre ?
 * @param {Number} thetaStart Start angle for first segment
 * @param {Number} theta Angle de fermeture du cylindre
 * @param {Number} color Couleur du cylindre
 * @param {Number} opacity Opacite de la sphere
 * @param {Boolean} wireframe Afficher en filament de la sphere
 */
export function createCylinder(radius, height, radialSegments, heightSegments, openEnded = false, thetaStart = 0, theta = 6.3, color = 0xffaaaa, opacity = 1, wireframe = false) {
	const geo = new THREE.CylinderGeometry(radius, radius, height, radialSegments, heightSegments, openEnded, thetaStart, theta);
	const mat = new THREE.MeshLambertMaterial({ color, transparent: true, opacity, wireframe });
	return new THREE.Mesh(geo, mat);
}

/**
 * Creer un cone
 * @param {Number} radius Rayon haut du cylindre
 * @param {Number} height Hauteur du cylindre
 * @param {Number} radialSegments Nombre de segments 
 * @param {Number} heightSegments Hauteur des segments
 * @param {Number} openEnded Ouvrir le cylindre ?
 * @param {Number} color Couleur du cylindre
 * @param {Number} opacity Opacite de la sphere
 * @param {Boolean} wireframe Afficher en filament de la sphere
 */
export function createCone(radius, height, radialSegments, heightSegments, openEnded = false, color = 0xffaaaa, opacity = 1, wireframe = false) {
	const geo = new THREE.ConeGeometry(radius, height, radialSegments, heightSegments, openEnded);
	const mat = new THREE.MeshLambertMaterial({ color, transparent: true, opacity, wireframe });
	return new THREE.Mesh(geo, mat);
}


/**
 * Charger un objet 3D
 * @param {String} nom Nom de l'objet
 * @param {String} objPath Chemin du fichier .obj
 * @param {String} mtlPath Chemin du fichier .mtl
 */
export function loadObj(nom, objPath, mtlPath) {
	const mtlLoader = new MTLLoader();
	const objLoader = new OBJLoader();
	const groupe = new THREE.Group();
	groupe.name = nom;

	mtlLoader.load(mtlPath, function (materials) {
		materials.preload();
		objLoader.setMaterials(materials);
		objLoader.load(objPath, function (object) {
			groupe.add(object);
			object.name = nom;
			return groupe;
		});
	});
	return groupe;
}