"use strict";

module.exports = function(ecs) {
	ecs.addEach(function(entity, elapsed) {
		entity.position.x += entity.velocity.x * elapsed;
		entity.position.y += entity.velocity.y * elapsed;
	}, ["position", "velocity"]);
};
