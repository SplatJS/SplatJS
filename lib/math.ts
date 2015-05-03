"use strict";

/**
 * @namespace Splat.math
 */

/**
 * A seedable pseudo-random number generator. Currently a Mersenne Twister PRNG.
 * @constructor
 * @alias Splat.math.Random
 * @param {number} [seed] The seed for the PRNG.
 * @see [mersenne-twister package at github]{@link https://github.com/boo1ean/mersenne-twister}
 * @example
var rand = new Splat.math.Random(123);
var val = rand.random();
 */
export import Random = require('mersenne-twister');

/**
 * Oscillate between -1 and 1 given a value and a period. This is basically a simplification on using Math.sin().
 * @alias Splat.math.oscillate
 * @param {number} current The current value of the number you want to oscillate.
 * @param {number} period The period, or how often the number oscillates. The return value will oscillate between -1 and 1, depending on how close current is to a multiple of period.
 * @returns {number} A number between -1 and 1.
 * @example
Splat.math.oscillate(0, 100); // returns 0
Splat.math.oscillate(100, 100); // returns 0-ish
Splat.math.oscillate(50, 100); // returns 1
Splat.math.oscillate(150, 100); // returns -1
Splat.math.oscillate(200, 100); // returns 0-ish
 */
export function oscillate(current: number, period: number) {
	return Math.sin(current / period * Math.PI);
}
