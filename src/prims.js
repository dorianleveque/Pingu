import * as THREE from "../lib/three.module.js";
import { MTLLoader } from "../lib/MTLLoader.js"
import { OBJLoader } from "../lib/OBJLoader.js"

// ======================================================================================================================
// Fonctions utilitaires pour créer des objets graphiques 3d spécifiques aux projets à développer
// ======================================================================================================================

/**
 * Créer un sol
 * @param {Number} largeur Largeur de la scene
 * @param {Number} hauteur Hauteur de la scene
 * @param {Number} couleur Couleur de la scene
 * @param {String} texture Nom de la texture
 */
export function creerSol(largeur, hauteur, couleur = 0xaaaaaa, texture = null) {
	const geo = new THREE.PlaneGeometry(largeur, hauteur);
	const mat = new THREE.MeshStandardMaterial({ color: couleur });
	const mesh = new THREE.Mesh(geo, mat);
	mesh.rotation.x = -Math.PI / 2.0;
	return mesh;
}

/**
 * Créer une boite
 * @param {Number} largeur Largeur de la boite
 * @param {Number} hauteur Hauteur de la boite
 * @param {Number} profondeur Profondeur de la boite
 * @param {Number} couleur Couleur de la boite
 * @param {String} texture Nom de la texture
 */
export function creerBoite(largeur, hauteur, profondeur, couleur = 0xffaaaa, texture = null) {
	const geo = new THREE.BoxGeometry(largeur, hauteur, profondeur);
	const mat = new THREE.MeshStandardMaterial({ color: couleur });
	return new THREE.Mesh(geo, mat);
}

/**
 * Créer une sphere
 * @param {Number} rayon Rayon de la sphere
 * @param {Number} couleur Couleur de la sphere
 * @param {String} texture Nom de la texture
 */
export function creerSphere(rayon, couleur = 0xffaaaa, texture = null) {
	const geo = new THREE.SphereGeometry(rayon, 32, 32);
	const mat = new THREE.MeshStandardMaterial({ color: couleur });
	return new THREE.Mesh(geo, mat);
}

/**
 * Creer un tetrahedre
 * @param {Number} rayon rayon du tetrahedre
 * @param {Number} detail nombre de polygone
 * @param {Number} couleur Couleur du tetrahedre
 */
export function creerTetrahedre(rayon, detail, couleur = 0xffaaaa) {
	const geo = new THREE.TetrahedronGeometry(rayon, detail);
	const mat = new THREE.MeshStandardMaterial({ color: couleur });
	return new THREE.Mesh(geo, mat);
}

/**
 * Charger un objet 3D
 * @param {String} nom Nom de l'objet
 * @param {String} objPath Chemin du fichier .obj
 * @param {String} mtlPath Chemin du fichier .mtl
 */
export function chargerObj(nom, objPath, mtlPath) {
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

THREE.ObjectLoader