"use strict";

var Camera = require("./camera");

/**
 * A Scene handles the render loop for the game.
 * @constructor
 * @param {external:canvas} canvas The canvas to render on.
 * @param {emptyCallback} initFunc A callback to be called every time the Scene is {@link Scene#start started}.
 * @param {simulationCallback} simulationFunc A callback that updates the state of the game's simulation.
 * @param {drawCallback} drawFunc A callback that draws the game.
 */
function Scene(canvas, initFunc, simulationFunc, drawFunc) {
	/**
	 * The canvas to render on.
	 * @member {external:canvas}
	 * @private
	 */
	this.canvas = canvas;
	/**
	 * A callback to be called ever time the Scene is {@link Scene#start started}.
	 * @member {emptyCallback}
	 * @private
	 */
	this.initFunc = initFunc;
	/**
	 * A callback that updates the state of the game's simulation.
	 * @member {simulationCallback}
	 * @private
	 */
	this.simulationFunc = simulationFunc;
	/**
	 * A callback that draws the game.
	 * @member {drawCallback}
	 * @private
	 */
	this.drawFunc = drawFunc;

	/**
	 * The drawing context for {@link Scene#canvas}
	 * @member {external:CanvasRenderingContext2D}
	 * @private
	 */
	this.context = canvas.getContext("2d");
	/**
	 * The timestamp of the last frame. Used to determine how many milliseconds elapsed between frames.
	 * @member {number}
	 * @private
	 */
	this.lastTimestamp = -1;
	/**
	 * Whether or not the Scene is currently running.
	 * @member {boolean}
	 * @private
	 */
	this.running = false;
	/**
	 * A key-value store of named timers. Timers in this object will be automatically {@link Timer#tick ticked} for you when the scene is running.
	 * @member {object}
	 */
	this.timers = {};

	/**
	 * The Camera used to offset the Scene's drawing.
	 * This Camera's {@link Entity#move move} and {@link Camera#draw draw} methods are called automatically for you. The default Camera starts at the origin (0,0).
	 * @member {Camera}
	 */
	this.camera = new Camera(0, 0, canvas.width, canvas.height);
	/**
	 * A flag that enables/disables a frame rate counter in the corner of the screen. This is useful during development.
	 * @member {boolean}
	 */
	this.showFrameRate = false;
}
/**
 * Start running the scene.
 */
Scene.prototype.start = function() {
	this.lastTimestamp = -1;
	this.running = true;
	this.initFunc.call(this);
	var scene = this;
	window.requestAnimationFrame(function(t) { mainLoop(scene, t); });
};
/**
 * Stop running the scene.
 */
Scene.prototype.stop = function() {
	this.running = false;
};
/**
 * Reset the simulation by re-running the {@link Scene#initFunc}.
 */
Scene.prototype.reset = function() {
	this.initFunc.call(this);
};

function mainLoop(scene, timestamp) {
	if (!scene.running) {
		return;
	}
	if (scene.lastTimestamp === -1) {
		scene.lastTimestamp = timestamp;
	}
	var elapsedMillis = timestamp - scene.lastTimestamp;
	scene.lastTimestamp = timestamp;

	incrementTimers(scene.timers, elapsedMillis);
	if (!scene.running) {
		return;
	}
	scene.simulationFunc.call(scene, elapsedMillis);
	scene.camera.move(elapsedMillis);

	scene.context.save();
	scene.camera.draw(scene.context);
	scene.drawFunc.call(scene, scene.context);

	if (scene.showFrameRate) {
		drawFrameRate(scene, elapsedMillis);
	}

	scene.context.restore();

	if (scene.running) {
		window.requestAnimationFrame(function(t) { mainLoop(scene, t); });
	}
}

function incrementTimers(timers, elapsedMillis) {
	for (var i in timers) {
		if (timers.hasOwnProperty(i)) {
			timers[i].tick(elapsedMillis);
		}
	}
}

function drawFrameRate(scene, elapsedMillis) {
	var fps = (1000 / elapsedMillis) |0;

	scene.context.font = "24px mono";
	if (fps < 30) {
		scene.context.fillStyle = "#ff0000";
	} else if (fps < 50) {
		scene.context.fillStyle = "#ffff00";
	} else {
		scene.context.fillStyle = "#00ff00";
	}
	var msg = fps + " FPS";
	var w = scene.context.measureText(msg).width;
	scene.camera.drawAbsolute(scene.context, function() {
		scene.context.fillText(msg, scene.canvas.width - w - 50, 50);
	});
}

module.exports = Scene;
