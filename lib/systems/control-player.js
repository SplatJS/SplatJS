"use strict";

module.exports = function(ecs, input) {
	ecs.addEach(function(entity, elapsed) { // jshint ignore:line
		entity.movement2d.up = input.button(entity.playerController2d.up);
		entity.movement2d.down = input.button(entity.playerController2d.down);
		entity.movement2d.left = input.button(entity.playerController2d.left);
		entity.movement2d.right = input.button(entity.playerController2d.right);
	}, ["movement2d", "playerController2d"]);
};
