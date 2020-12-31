// ======================================================================================================================
// Utility functions of the project
// ======================================================================================================================

/**
 * Returns a random number between the minimum and maximum value between
 * @param {Number} min Minimum number
 * @param {Number} max Maximum number
 */
export function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random number between 0 and the maximum value entered.
 * @param {Number} value Maximum number
 */
export function random(value) {
  return Math.random() * value;
}

/**
 * Returns random coordinates
 * @param {Number} minX minimum number x
 * @param {Number} maxX maximum number x
 * @param {Number} minY minimum number y
 * @param {Number} maxY maximum number y
 * @returns {Object} [x, y] 
 */
export function getRandCoord(minX, maxX, minY, maxY) {
  minX = Math.ceil(minX)
  minY = Math.ceil(minY)
  maxX = Math.floor(maxX)
  maxY = Math.floor(maxY)
  return [randomRange(minX, maxX), randomRange(minY, maxY)];
}

/**
 * Convert radians to degrees
 * @param {Number} rad radians
 */
export function rad2deg(rad) {
  return rad * (180 / Math.PI);
}

/**
 * Convert degrees to radians
 * @param {Number} deg degrees
 */
export function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Return the average of the number passed in parameters
 * @param  {...any Number} values 
 */
export function average(...values) {
  return values.reduce((acc, val) => acc + val) / values.length
}