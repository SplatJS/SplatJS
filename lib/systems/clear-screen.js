"use strict";

module.exports = function(ecs, canvas) {
	ecs.add(function(entities, context) { // jshint ignore:line
		context.clearRect(0, 0, canvas.width, canvas.height);
	});
};
