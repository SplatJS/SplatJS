"use strict";

module.exports = function animation(name, loop) {
	return {
		name: name,
		time: 0,
		frame: 0,
		loop: loop,
		speed: 1
	};
};
