"use strict";

interface SoundLoader {
	load(name: string, path: string): void;
	allLoaded(): boolean;
	isMuted(): boolean;
	play(name: string, loop: boolean): void;
	stop(name: string): void;
	mute(): void;
	unmute(): void;
	setVolume(gain: number): void;
	loadedSounds: number;
	totalSounds: number;
}

(<any>window).AudioContext = (<any>window).AudioContext || (<any>window).webkitAudioContext;

var soundLoader: { new(): SoundLoader };

class WebAudioSoundLoader implements SoundLoader {
	private gainNode: any;
	private volume: number;
	
	/**
	 * The key-value object that stores named sounds.
	 * @member {object}
	 * @private
	 */
	private sounds: { [name: string]: any } = {};
	/**
	 * The total number of sounds to be loaded.
	 * @member {number}
	 * @private
	 */
	totalSounds = 0;
	/**
	 * The number of sounds that have loaded completely.
	 * @member {number}
	 * @private
	 */
	loadedSounds = 0;
	/**
	 * A flag signifying if sounds have been muted through {@link SoundLoader#mute}.
	 * @member {boolean}
	 * @private
	 */
	private muted = false;
	/**
	 * A key-value object that stores named looping sounds.
	 * @member {object}
	 * @private
	 */
	private looping: { [name: string]: any } = {};

	/**
	 * The Web Audio API AudioContext
	 * @member {external:AudioContext}
	 * @private
	 */
	private context = new (<any>window).AudioContext();
		
	/**
	 * Loads sound files and lets you know when they're all available. An instance of SoundLoader is available as {@link Splat.Game#sounds}.
	 * This implementation uses the Web Audio API, and if that is not available it automatically falls back to the HTML5 &lt;audio&gt; tag.
	 * @constructor
	 */
	constructor() {
		this.gainNode = this.context.createGain();
		this.gainNode.connect(this.context.destination);
		this.volume = this.gainNode.gain.value;
	}
	
	private firstPlay: string;
	private firstPlayLoop: boolean;
	
	/**
	 * Load an audio file.
	 * @param {string} name The name you want to use when you {@link SoundLoader#play} the sound.
	 * @param {string} path The path of the sound file.
	 */
	load(name: string, path: string) {
		if (this.totalSounds === 0) {
			// safari on iOS mutes sounds until they're played in response to user input
			// play a dummy sound on first touch
			var firstTouchHandler = () => {
				window.removeEventListener("click", firstTouchHandler);
				window.removeEventListener("keydown", firstTouchHandler);
				window.removeEventListener("touchstart", firstTouchHandler);
	
				var source = this.context.createOscillator();
				source.connect(this.gainNode);
				source.start(0);
				source.stop(0);
	
				if (this.firstPlay) {
					this.play(this.firstPlay, this.firstPlayLoop);
				} else {
					this.firstPlay = "workaround";
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
		request.addEventListener("readystatechange", () => {
			if (request.readyState !== 4) {
				return;
			}
			if (request.status !== 200 && request.status !== 0) {
				console.error("Error loading sound " + path);
				return;
			}
			this.context.decodeAudioData(request.response, function(buffer: any) {
				this.sounds[name] = buffer;
				this.loadedSounds++;
			}, function(err: any) {
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
	}
	
	/**
	 * Test if all sounds have loaded.
	 * @returns {boolean}
	 */
	allLoaded() {
		return this.totalSounds === this.loadedSounds;
	}
	
	/**
	 * Play a sound.
	 * @param {string} name The name given to the sound during {@link SoundLoader#load}
	 * @param {boolean} [loop=false] A flag denoting whether the sound should be looped. To stop a looped sound use {@link SoundLoader#stop}.
	 */
	play(name: string, loop: boolean) {
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
	}
	
	/**
	 * Stop playing a sound. This currently only stops playing a sound that was looped earlier, and doesn't stop a sound mid-play. Patches welcome.
	 * @param {string} name The name given to the sound during {@link SoundLoader#load}
	 */
	stop(name: string) {
		if (!this.looping[name]) {
			return;
		}
		this.looping[name].stop();
		delete this.looping[name];
	}
	
	/**
	 * Silence all sounds. Sounds keep playing, but at zero volume. Call {@link SoundLoader#unmute} to restore the previous volume level.
	 */
	mute() {
		this.gainNode.gain.value = 0;
		this.muted = true;
	}
	
	/**
	 * Restore volume to whatever value it was before {@link SoundLoader#mute} was called.
	 */
	unmute() {
		this.gainNode.gain.value = this.volume;
		this.muted = false;
	}
	
	/**
	 * Set the volume of all sounds.
	 * @param {number} gain The desired volume level. A number between 0.0 and 1.0, with 0.0 being silent, and 1.0 being maximum volume.
	 */
	setVolume(gain: number) {
		this.volume = gain;
		this.gainNode.gain  = gain;
		this.muted = false;
	}
	
	/**
	 * Test if the volume is currently muted.
	 * @return {boolean} True if the volume is currently muted.
	 */
	isMuted() {
		return this.muted;
	}
}

class AudioTagSoundLoader implements SoundLoader {
	sounds: { [name: string]: any } = {};
	totalSounds = 0;
	loadedSounds = 0;
	muted = false;
	looping: { [name: string]: any } = {};
	volume = new Audio().volume;
	
	load(name: string, path: string) {
		this.totalSounds++;
	
		var audio = new Audio();
		var self = this;
		audio.addEventListener("error", function() {
			console.error("Error loading sound " + path);
		});
		audio.addEventListener("canplaythrough", function() {
			self.sounds[name] = audio;
			self.loadedSounds++;
		});
		audio.volume = this.volume;
		audio.src = path;
		audio.load();
	};
	allLoaded() {
		return this.totalSounds === this.loadedSounds;
	}
	play(name: string, loop: boolean) {
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
	}
	stop(name: string) {
		var snd = this.looping[name];
		if (!snd) {
			return;
		}
		snd.loop = false;
		snd.pause();
		snd.currentTime = 0;
		delete this.looping[name];
	}
	setAudioTagVolume(gain: number) {
		for (var name in this.sounds) {
			if (this.sounds.hasOwnProperty(name)) {
				this.sounds[name].volume = gain;
			}
		}
	}
	mute() {
		this.setAudioTagVolume(0);
		this.muted = true;
	}
	unmute() {
		this.setAudioTagVolume(this.volume);
		this.muted = false;
	}
	setVolume(gain: number) {
		this.volume = gain;
		this.setAudioTagVolume(gain);
		this.muted = false;
	}
	isMuted() {
		return this.muted;
	}
}

class FakeSoundLoader implements SoundLoader {
	load(name: string, path: string) {}
	play(name: string, loop: boolean) {}
	stop(name: string) {}
	mute() {}
	unmute() {}
	setVolume(gain: number) {}
	
    allLoaded()
	{
		 return true;
	}

	isMuted() {
		return true;
	}
}

if ((<any>window).AudioContext) {
	soundLoader = WebAudioSoundLoader;
} else if ((<any>window).Audio) {
	soundLoader = AudioTagSoundLoader;
} else {
	console.log("This browser doesn't support the Web Audio API or the HTML5 audio tag.");
	soundLoader = FakeSoundLoader;
}

export = soundLoader;