var Splat = (function(splat, window) {

	function SoundLoader() {
		this.sounds = {};
		this.totalSounds = 0;
		this.loadedSounds = 0;
		this.muted = false;

		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		this.context = new AudioContext();
	}
	SoundLoader.prototype.load = function(name, path) {
		var that = this;

		if (this.totalSounds === 0) {
			// safari on iOS mutes sounds until they're played in response to user input
			// play a dummy sound on first touch
			var firstTouchHandler = function(event) {
				window.removeEventListener("click", firstTouchHandler);
				window.removeEventListener("keydown", firstTouchHandler);
				window.removeEventListener("touchstart", firstTouchHandler);

				var source = that.context.createOscillator();
				source.connect(that.context.destination);
				source.start(0);
				source.stop(0);

				if (that.firstPlay) {
					that.play(that.firstPlay);
				} else {
					that.firstPlay = "workaround";
				}

			};
			window.addEventListener("click", firstTouchHandler);
			window.addEventListener("keydown", firstTouchHandler);
			window.addEventListener("touchstart", firstTouchHandler);
		}

		this.totalSounds++;

		var request = new XMLHttpRequest();
		request.open("GET", path, true);
		request.responseType = "arraybuffer";
		request.addEventListener("readystatechange", function() {
			if (request.readyState != 4) {
				return;
			}
			if (request.status !== 200 && request.status !== 0) {
				console.log("Error loading sound " + path);
				return;
			}
			that.context.decodeAudioData(request.response, function(buffer) {
				that.sounds[name] = buffer;
				that.loadedSounds++;
			});
		});
		request.addEventListener("error", function() {
			console.log("Error loading sound " + path);
		});
		request.send();
	};
	SoundLoader.prototype.allLoaded = function() {
		return this.totalSounds == this.loadedSounds;
	};
	SoundLoader.prototype.play = function(name) {
		if (!this.firstPlay) {
			// let the iOS user input workaround handle it
			this.firstPlay = name;
			return;
		}
		if (this.muted) {
			return;
		}
		var source = this.context.createBufferSource();
		source.buffer = this.sounds[name];
		source.connect(this.context.destination);
		source.start(0);
	};

	if (window.Audiocontext) {
		splat.SoundLoader = SoundLoader;
	} else {
		console.log("This browser doesn't support the Web Audio API");
		splat.SoundLoader = function() { };
		splat.SoundLoader.prototype.load = function() { };
		splat.SoundLoader.prototype.allLoaded = function() { return true; };
		splat.SoundLoader.prototype.play = function() { };
	}

	return splat;

}(Splat || {}, window));
