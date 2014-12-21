"use strict";

var Scene = require("./scene");

module.exports = function(canvas, percentLoaded, nextScene) {
	var scene = new Scene();
	scene.renderer.add(function(entities, context) { // jshint ignore:line
		context.fillStyle = "#000000";
		context.fillRect(0, 0, canvas.width, canvas.height);

		var quarterWidth = Math.floor(canvas.width / 4);
		var halfWidth = Math.floor(canvas.width / 2);
		var halfHeight = Math.floor(canvas.height / 2);

		context.fillStyle = "#ffffff";
		context.fillRect(quarterWidth, halfHeight - 15, halfWidth, 30);

		context.fillStyle = "#000000";
		context.fillRect(quarterWidth + 3, halfHeight - 12, halfWidth - 6, 24);

		context.fillStyle = "#ffffff";
		var barWidth = (halfWidth - 6) * percentLoaded();
		context.fillRect(quarterWidth + 3, halfHeight - 12, barWidth, 24);

		if (percentLoaded() === 1) {
			scene.stop();
			nextScene.start(context);
		}
	});
	return scene;
};
