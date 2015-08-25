"use strict";

window.AudioContext = window.AudioContext || window.webkitAudioContext;

/**
 * Loads sound files and lets you know when they're all available. An instance of SoundLoader is available as {@link Splat.Game#sounds}.
 * This implementation uses the Web Audio API, and if that is not available it automatically falls back to the HTML5 &lt;audio&gt; tag.
 * @constructor
 */
function SoundLoader(onLoad) {
	/**
	 * The key-value object that stores named sounds.
	 * @member {object}
	 * @private
	 */
	this.sounds = {};
	/**
	 * The total number of sounds to be loaded.
	 * @member {number}
	 * @private
	 */
	this.totalSounds = 0;
	/**
	 * The number of sounds that have loaded completely.
	 * @member {number}
	 * @private
	 */
	this.loadedSounds = 0;
	/**
	 * A flag signifying if sounds have been muted through {@link SoundLoader#mute}.
	 * @member {boolean}
	 * @private
	 */
	this.muted = false;
	/**
	 * A key-value object that stores named looping sounds.
	 * @member {object}
	 * @private
	 */
	this.looping = {};

	/**
	 * The Web Audio API AudioContext
	 * @member {external:AudioContext}
	 * @private
	 */
	this.context = new window.AudioContext();

	this.gainNode = this.context.createGain();
	this.gainNode.connect(this.context.destination);
	this.volume = this.gainNode.gain.value;
	this.onLoad = onLoad;
}
/**
 * Load an audio file.
 * @param {string} name The name you want to use when you {@link SoundLoader#play} the sound.
 * @param {string} path The path of the sound file.
 */
SoundLoader.prototype.load = function(name, path) {
	var self = this;

	if (this.totalSounds === 0) {
		// safari on iOS mutes sounds until they're played in response to user input
		// play a dummy sound on first touch
		var firstTouchHandler = function() {
			window.removeEventListener("click", firstTouchHandler);
			window.removeEventListener("keydown", firstTouchHandler);
			window.removeEventListener("touchstart", firstTouchHandler);

			var source = self.context.createOscillator();
			source.connect(self.gainNode);
			source.start(0);
			source.stop(0);

			if (self.firstPlay) {
				self.play(self.firstPlay, self.firstPlayLoop);
			} else {
				self.firstPlay = "workaround";
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
		if (request.readyState !== 4) {
			return;
		}
		if (request.status !== 200 && request.status !== 0) {
			console.error("Error loading sound " + path);
			return;
		}
		self.context.decodeAudioData(request.response, function(buffer) {
			self.sounds[name] = buffer;
			self.loadedSounds++;
			if (self.allLoaded() && self.onLoad) {
				self.onLoad();
			}
		}, function(err) {
			console.error("Error decoding audio data for " + path + ": " + err);
		});
	});
	request.addEventListener("error", function() {
		console.error("Error loading sound " + path);
	});
	try {
		request.send();
	} catch (e) {
		console.error("Error loading sound", path, e);
	}
};
SoundLoader.prototype.loadFromManifest = function(manifest) {
	var keys = Object.keys(manifest);
	var self = this;
	keys.forEach(function(key) {
		self.load(key, manifest[key]);
	});
};
/**
 * Test if all sounds have loaded.
 * @returns {boolean}
 */
SoundLoader.prototype.allLoaded = function() {
	return this.totalSounds === this.loadedSounds;
};
/**
 * Play a sound.
 * @param {string} name The name given to the sound during {@link SoundLoader#load}
 * @param {boolean} [loop=false] A flag denoting whether the sound should be looped. To stop a looped sound use {@link SoundLoader#stop}.
 */
SoundLoader.prototype.play = function(name, loop) {
	if (loop && this.looping[name]) {
		return;
	}
	if (!this.firstPlay) {
		// let the iOS user input workaround handle it
		this.firstPlay = name;
		this.firstPlayLoop = loop;
		return;
	}
	var snd = this.sounds[name];
	if (snd === undefined) {
		console.error("Unknown sound: " + name);
	}
	var source = this.context.createBufferSource();
	source.buffer = snd;
	source.connect(this.gainNode);
	if (loop) {
		source.loop = true;
		this.looping[name] = source;
	}
	source.start(0);
};
/**
 * Stop playing a sound. This currently only stops playing a sound that was looped earlier, and doesn't stop a sound mid-play. Patches welcome.
 * @param {string} name The name given to the sound during {@link SoundLoader#load}
 */
SoundLoader.prototype.stop = function(name) {
	if (!this.looping[name]) {
		return;
	}
	this.looping[name].stop(0);
	delete this.looping[name];
};
/**
 * Silence all sounds. Sounds keep playing, but at zero volume. Call {@link SoundLoader#unmute} to restore the previous volume level.
 */
SoundLoader.prototype.mute = function() {
	this.gainNode.gain.value = 0;
	this.muted = true;
};
/**
 * Restore volume to whatever value it was before {@link SoundLoader#mute} was called.
 */
SoundLoader.prototype.unmute = function() {
	this.gainNode.gain.value = this.volume;
	this.muted = false;
};
/**
 * Set the volume of all sounds.
 * @param {number} gain The desired volume level. A number between 0.0 and 1.0, with 0.0 being silent, and 1.0 being maximum volume.
 */
SoundLoader.prototype.setVolume = function(gain) {
	this.volume = gain;
	this.gainNode.gain  = gain;
	this.muted = false;
};
/**
 * Test if the volume is currently muted.
 * @return {boolean} True if the volume is currently muted.
 */
SoundLoader.prototype.isMuted = function() {
	return this.muted;
};

function AudioTagSoundLoader(onLoad) {
	this.sounds = {};
	this.totalSounds = 0;
	this.loadedSounds = 0;
	this.muted = false;
	this.looping = {};
	this.volume = new Audio().volume;
	this.onLoad = onLoad;
}
AudioTagSoundLoader.prototype.load = function(name, path) {
	this.totalSounds++;

	var audio = new Audio();
	var self = this;
	audio.addEventListener("error", function() {
		console.error("Error loading sound " + path);
	});
	audio.addEventListener("canplaythrough", function() {
		self.sounds[name] = audio;
		self.loadedSounds++;
		if (self.allLoaded() && self.onLoad) {
			self.onLoad();
		}
	});
	audio.volume = this.volume;
	audio.src = path;
	audio.load();
};
AudioTagSoundLoader.prototype.loadFromManifest = function(manifest) {
	var keys = Object.keys(manifest);
	var self = this;
	keys.forEach(function(key) {
		self.load(key, manifest[key]);
	});
};
AudioTagSoundLoader.prototype.allLoaded = function() {
	return this.totalSounds === this.loadedSounds;
};
AudioTagSoundLoader.prototype.play = function(name, loop) {
	if (loop && this.looping[name]) {
		return;
	}
	var snd = this.sounds[name];
	if (snd === undefined) {
		console.error("Unknown sound: " + name);
	}
	if (loop) {
		snd.loop = true;
		this.looping[name] = snd;
	}
	snd.play();
};
AudioTagSoundLoader.prototype.stop = function(name) {
	var snd = this.looping[name];
	if (!snd) {
		return;
	}
	snd.loop = false;
	snd.pause();
	snd.currentTime = 0;
	delete this.looping[name];
};
function setAudioTagVolume(sounds, gain) {
	for (var name in sounds) {
		if (sounds.hasOwnProperty(name)) {
			sounds[name].volume = gain;
		}
	}
}
AudioTagSoundLoader.prototype.mute = function() {
	setAudioTagVolume(this.sounds, 0);
	this.muted = true;
};
AudioTagSoundLoader.prototype.unmute = function() {
	setAudioTagVolume(this.sounds, this.volume);
	this.muted = false;
};
AudioTagSoundLoader.prototype.setVolume = function(gain) {
	this.volume = gain;
	setAudioTagVolume(this.sounds, gain);
	this.muted = false;
};
AudioTagSoundLoader.prototype.isMuted = function() {
	return this.muted;
};


function FakeSoundLoader(onLoad) {
	this.onLoad = onLoad;
}
FakeSoundLoader.prototype.load = function() {
	if (this.onLoad) {
		this.onLoad();
	}
};
FakeSoundLoader.prototype.loadFromManifest = function() {};
FakeSoundLoader.prototype.allLoaded = function() { return true; };
FakeSoundLoader.prototype.play = function() {};
FakeSoundLoader.prototype.stop = function() {};
FakeSoundLoader.prototype.mute = function() {};
FakeSoundLoader.prototype.unmute = function() {};
FakeSoundLoader.prototype.setVolume = function() {};
FakeSoundLoader.prototype.isMuted = function() {
	return true;
};

if (window.AudioContext) {
	module.exports = SoundLoader;
} else if (window.Audio) {
	module.exports = AudioTagSoundLoader;
} else {
	console.log("This browser doesn't support the Web Audio API or the HTML5 audio tag.");
	module.exports = FakeSoundLoader;
}
