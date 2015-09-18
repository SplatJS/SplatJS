"use strict";

var Camera = require("./camera");

/**
 * A Scene handles the render loop for the game. Inside of initFunc, simulationFunc, and drawFunc `this` refers to the current scene.
 * @constructor
 * @alias Splat.Scene
 * @param {external:canvas} canvas The canvas to render on.
 * @param {emptyCallback} initFunc A callback to be called every time the Scene is {@link Splat.Scene#start started}.
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
	 * A callback to be called ever time the Scene is {@link Splat.Scene#start started}.
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
	 * How frequently to run the simulation in Hertz (cycles per second). This should be higher than your expected framerate.
	 * @member {number}
	 * @private
	 */
	this.simulationFrequencyHz = 180;
	/**
	 * An accumulator of the leftover time between frames. This lets us run the simulation at a constant framerate independant of the drawing framerate.
	 * @member {number}
	 * @private
	 */
	this.timeAccumulator = 0;
	/**
	 * Whether or not the Scene is currently running.
	 * @member {boolean}
	 * @private
	 */
	this.running = false;
	/**
	 * A key-value store of named timers. Timers in this object will be automatically {@link Splat.Timer#tick tick()}ed for you when the scene is running..
	 * @member {object}
	 */
	this.timers = {};

	/**
	 * The Camera used to offset the Scene's drawing.
	 * This Camera's {@link Splat.Entity#move move} and {@link Splat.Camera#draw draw} methods are called automatically for you. The default Camera starts at the origin (0,0).
	 * @member {Splat.Camera}
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
 * Reset the simulation by re-running the {@link Splat.Scene#initFunc}.
 */
Scene.prototype.reset = function() {
	this.initFunc.call(this);
};

var gamepad = require("./gamepad");

function mainLoop(scene, timestamp) {
	if (!scene.running) {
		return;
	}
	if (scene.lastTimestamp === -1) {
		scene.lastTimestamp = timestamp;
	}
	var elapsedMillis = timestamp - scene.lastTimestamp;
	scene.lastTimestamp = timestamp;

	gamepad.update();

	scene.timeAccumulator += elapsedMillis;
	var simulationMs = Math.floor(1000 / scene.simulationFrequencyHz);
	while (scene.timeAccumulator > simulationMs) {
		scene.timeAccumulator -= simulationMs;

		incrementTimers(scene.timers, simulationMs);
		if (!scene.running) {
			return;
		}
		scene.simulationFunc.call(scene, simulationMs);
		scene.camera.move(simulationMs);
	}

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
