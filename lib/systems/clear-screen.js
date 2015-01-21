"use strict";

module.exports = function(ecs, data) {
	ecs.add(function(entities, context) { // jshint ignore:line
		context.clearRect(0, 0, data.canvas.width, data.canvas.height);
	});
};
