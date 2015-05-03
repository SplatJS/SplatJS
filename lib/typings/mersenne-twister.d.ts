declare class MersenneTwister {
	constructor(seed?: number);
	/// Generates a random number on [0,1) real interval (same interval as Math.random) 
	random(): number;
	/// [0, 4294967295]
	random_int(): number;
	/// [0, 1]
	random_incl(): number;
	/// (0, 1)
	random_excl(): number;
	/// [0, 1) with 53-bit resolution
	random_long(): number;
	/// [0, 2147483647]
	random_int31(): number;
}

declare module "mersenne-twister" {
	export = MersenneTwister;
}