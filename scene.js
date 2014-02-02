var Splat = (function(splat, window, document) {

	function time(f, iters) {
		var start = window.performance.now();
		for (var i = 0; i < iters; i++) {
			f();
		}
		var stop = window.performance.now();
		return stop - start;
	}

	function Scene(canvas, initFunc, simulationFunc, drawFunc) {
		var context = canvas.getContext("2d");
		var lastTimestamp = -1;
		var running = false;
		var that = this;
		var timers = {};

		this.camera = new Splat.Camera(0, 0, canvas.width, canvas.height);
		this.showFrameRate = false;

		function drawFrameRate(elapsedMillis) {
			var fps = (1000 / elapsedMillis) |0;

			context.font = "24px mono";
			if (fps < 30) {
				context.fillStyle = "#ff0000";
			} else if (fps < 50) {
				context.fillStyle = "#ffff00";
			} else {
				context.fillStyle = "#00ff00";
			}
			var msg = fps + " FPS";
			var w = context.measureText(msg).width;
			that.camera.drawAbsolute(context, function() {
				context.fillText(msg, canvas.width - w - 50, 50);
			});
		}

		function incrementTimers(elapsedMillis) {
			for (var i in timers) {
				if (timers.hasOwnProperty(i)) {
					timers[i] += elapsedMillis;
				}
			}
		}

		function mainLoop(timestamp) {
			if (lastTimestamp === -1) {
				lastTimestamp = timestamp;
			}
			var elapsedMillis = timestamp - lastTimestamp;
			lastTimestamp = timestamp;

			incrementTimers(elapsedMillis);
			simulationFunc.call(that, elapsedMillis);
			that.camera.move(elapsedMillis);

			context.save();
			that.camera.draw(context);
			drawFunc.call(that, context);

			if (that.showFrameRate) {
				drawFrameRate(elapsedMillis);
			}

			context.restore();

			if (running) {
				window.requestAnimationFrame(mainLoop);
			}
		}

		this.start = function() {
			running = true;
			initFunc.call(that);
			window.requestAnimationFrame(mainLoop);
		};

		this.stop = function() {
			running = false;
		};

		this.reset = function() {
			initFunc.call(that);
		};

		this.startTimer = function(name) {
			timers[name] = 0;
		};
		this.stopTimer = function(name) {
			delete timers[name];
		};
		this.clearTimers = function(name) {
			timers = {};
		};
		this.timer = function(name) {
			return timers[name];
		};
	}

	splat.time = time;
	splat.Scene = Scene;
	return splat;

}(Splat || {}, window, document));
