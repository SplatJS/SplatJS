"use strict";

var timeAccumulator = require("time-accumulator");

module.exports = function(entities, simulation, simulationStepTime, renderer, context) {
	var run = timeAccumulator(simulationStepTime);
	var timeDelta = require("./absolute-to-relative")();
	var running = true;

	function render(time) {
		if (!running) {
			return;
		}

		var elapsed = timeDelta(time);
		run(elapsed, function(elapsed) {
			simulation.run(entities.entities, elapsed);
		});

		context.save();
		renderer.run(entities.entities, context, elapsed);
		context.restore();

		if (running) {
			window.requestAnimationFrame(render);
		}
	}
	window.requestAnimationFrame(render);

	return function() {
		running = false;
	};
};
