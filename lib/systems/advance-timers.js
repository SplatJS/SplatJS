"use strict";

module.exports = function(ecs) {
	ecs.addEach(function(entity, elapsed) {
		var names = Object.keys(entity.timers);

		names.forEach(function(name) {
			var timer = entity.timers[name];
			if (!timer.running) {
				return;
			}

			timer.time += elapsed;

			if (timer.time > timer.max) {
				timer.running = false;
				timer.time = 0;

				if (timer.script !== undefined) {
					var script = require(timer.script);
					script(entity);
				}
			}
		});
	}, ["timers"]);
};
