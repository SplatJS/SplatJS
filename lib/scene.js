var Camera = require("./camera");

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
};

function Scene(canvas, initFunc, simulationFunc, drawFunc) {
	this.canvas = canvas;
	this.initFunc = initFunc;
	this.simulationFunc = simulationFunc;
	this.drawFunc = drawFunc;

	this.context = canvas.getContext("2d");
	this.lastTimestamp = -1;
	this.running = false;
	this.timers = {};

	this.camera = new Camera(0, 0, canvas.width, canvas.height);
	this.showFrameRate = false;
}
Scene.prototype.start = function() {
	this.lastTimestamp = -1;
	this.running = true;
	this.initFunc.call(this);
	var scene = this;
	window.requestAnimationFrame(function(t) { mainLoop(scene, t); });
};
Scene.prototype.stop = function() {
	this.running = false;
};
Scene.prototype.reset = function() {
	this.initFunc.call(this);
};

Scene.prototype.startTimer = function(name) {
	this.timers[name] = 0;
};
Scene.prototype.stopTimer = function(name) {
	delete this.timers[name];
};
Scene.prototype.clearTimers = function(name) {
	this.timers = {};
};
Scene.prototype.timer = function(name) {
	return this.timers[name];
};
function incrementTimers(timers, elapsedMillis) {
	for (var i in timers) {
		if (timers.hasOwnProperty(i)) {
			timers[i] += elapsedMillis;
		}
	}
};

module.exports = Scene;
