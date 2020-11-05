// ======================================================================================================================
// Fonctions utilitaires du projet
// ======================================================================================================================

/**
 * Retourne un nombre aléatoire compris entre la valeur minimale et maximale comprise
 * @param {Number} min Nombre minimal
 * @param {Number} max Nombre maximal
 */
export function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Retourne un nombre aléatoire compris entre 0 et la valeur maximale renseigné
 * @param {Number} value Nombre maximale généré
 */
export function random(value) {
  return Math.random() * value;
}

/**
 * Retourne des coordonnées aléatoire
 * @param {Number} minX nombre minimal x
 * @param {Number} maxX nombre maximal x
 * @param {Number} minY nombre minimal y
 * @param {Number} maxY nombre maximal y
 * @returns {Object} [x, y] 
 */
export function getRandCoord(minX, maxX, minY, maxY)
{
  minX = Math.ceil(minX)
  minY = Math.ceil(minY)
  maxX = Math.floor(maxX)
  maxY = Math.floor(maxY)
  return [randomRange(minX, maxX), randomRange(minY, maxY)];
}
