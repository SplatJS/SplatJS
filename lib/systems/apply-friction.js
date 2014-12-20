"use strict";

module.exports = function(ecs) {
	ecs.addEach(function(entity, elapsed) { // jshint ignore:line
		entity.velocity.x *= entity.friction.x;
		entity.velocity.y *= entity.friction.y;
	}, ["velocity", "friction"]);
};
