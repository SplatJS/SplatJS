"use strict";

function distanceSquared(x1, y1, x2, y2) {
	return ((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2));
}

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsed) { // jshint ignore:line
		var x1 = entity.position.x + (entity.size.width / 2);
		var y1 = entity.position.y + (entity.size.height / 2);

		var parent = data.entities.entities[entity.follow.id];
		if (parent === undefined) {
			return;
		}
		var x2 = parent.position.x + (parent.size.width / 2);
		var y2 = parent.position.y + (parent.size.height / 2);

		var angle = Math.atan2(y2 - y1, x2 - x1);
		if (entity.rotation !== undefined) {
			entity.rotation.angle = angle - (Math.PI / 2);
		}

		var distSquared = distanceSquared(x1, y1, x2, y2);
		if (distSquared < entity.follow.distance * entity.follow.distance) {
			return;
		}

		var toMove = Math.sqrt(distSquared) - entity.follow.distance;

		entity.position.x += toMove * Math.cos(angle);
		entity.position.y += toMove * Math.sin(angle);
	}, ["position", "follow"]);
};
