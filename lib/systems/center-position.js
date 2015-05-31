"use strict";

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsed) { // jshint ignore:line
		if (entity.center.x) {
			entity.position.x = Math.floor(data.canvas.width / 2);
			if (entity.size) {
				entity.position.x -= Math.floor(entity.size.width / 2);
			}
		}
		if (entity.center.y) {
			entity.position.y = Math.floor(data.canvas.height / 2);
			if (entity.size) {
				entity.position.y -= Math.floor(entity.size.height / 2);
			}
		}
	}, ["position", "center"]);
};
