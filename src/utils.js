// ======================================================================================================================
// Fonctions utilitaires du projet
// ======================================================================================================================

/**
 * Retourne un nombre aléatoire compris entre la valeur minimale et maximale comprise
 * @param {Number} min Nombre minimal
 * @param {Number} max Nombre maximal
 */
export function randomRange(min, max) {
  return Math.random() * (max - min + 1) + min;
}

/**
 * Retourne un nombre aléatoire compris entre 0 et la valeur maximale renseigné
 * @param {Number} value Nombre maximale généré
 */
export function random(value) {
  return Math.random() * value;
}

/**
 * Retourne des coordonnées aléatoires 
 * @param {Number} xmin 
 * @param {Number} xmax 
 * @param {Number} zmin 
 * @param {Number} zmax 
 */
export function getRandCoord(xmin, xmax, zmin, zmax)
{
  return randomRange(xmin, xmax), randomRange(zmin, zmax);
}