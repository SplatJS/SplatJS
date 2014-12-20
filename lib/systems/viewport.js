"use strict";

var x = 0;
var y = 0;

module.exports = {
	moveToCamera: function(ecs) {
		ecs.add(function(entities, context) { // jshint ignore:line
			x = 0;
			y = 0;
		});
		ecs.addEach(function(entity, context) {
			var dx = Math.floor(entity.position.x + entity.camera.x) - x;
			var dy = Math.floor(entity.position.y + entity.camera.y) - y;
			x += dx;
			y += dy;
			context.translate(-dx, -dy);
		}, ["camera", "position"]);
	},
	reset: function(ecs) {
		ecs.addEach(function(entity, context) { // jshint ignore:line
			context.translate(x, y);
			x = 0;
			y = 0;
		}, ["camera", "position"]);
	}
};
