"use strict";
/** @module math */

/**
 * Oscillate between -1 and 1 given a value and a period. This is basically a simplification on using Math.sin().
 * @param {number} current The current value of the number you want to oscillate.
 * @param {number} period The period, or how often the number oscillates. The return value will oscillate between -1 and 1, depending on how close current is to a multiple of period.
 * @returns A number between -1 and 1.
 * @example
oscillate(0, 100); // returns 0
oscillate(100, 100); // returns 0-ish
oscillate(50, 100); // returns 1
oscillate(150, 100); // returns -1
oscillate(200, 100); // returns 0-ish
 */
function oscillate(current, period) {
	return Math.sin(current / period * Math.PI);
}

module.exports = {
	oscillate: oscillate
};
