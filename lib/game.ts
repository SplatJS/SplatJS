"use strict";

import Scene = require("./scene");
import Mouse = require("./mouse");
import Accelerometer = require("./accelerometer");
import Keyboard = require("./keyboard");
import keyMap = require("./key_map");
import ImageLoader = require("./image_loader");
import SoundLoader = require("./sound_loader");
import FontLoader = require("./font_loader");
import AnimationLoader = require("./animation_loader");
import SceneManager = require("./scene_manager");
import platform = require("./platform");

function loadAssets(assetLoader: ImageLoader | SoundLoader, assets: { [key: string]: string }) {
	for (var key in assets) {
		if (assets.hasOwnProperty(key)) {
			assetLoader.load(key, assets[key]);
		}
	}
}

function makeLoadingScene(game: Game, canvas: HTMLCanvasElement, nextScene: string) {
	return new Scene(canvas, function() {
	}, function() {
		if (game.isLoaded()) {
			game.scenes.switchTo(nextScene);
		}
	}, function(context) {
		context.fillStyle = "#000000";
		context.fillRect(0, 0, canvas.width, canvas.height);

		var quarterWidth = (canvas.width / 4) |0;
		var halfWidth = (canvas.width / 2) |0;
		var halfHeight = (canvas.height / 2) |0;

		context.fillStyle = "#ffffff";
		context.fillRect(quarterWidth, halfHeight - 15, halfWidth, 30);

		context.fillStyle = "#000000";
		context.fillRect(quarterWidth + 3, halfHeight - 12, halfWidth - 6, 24);

		context.fillStyle = "#ffffff";
		var barWidth = (halfWidth - 6) * game.percentLoaded();
		context.fillRect(quarterWidth + 3, halfHeight - 12, barWidth, 24);
	});
}

function setCanvasSizeScaled(canvas: HTMLCanvasElement) {
	var ww = window.innerWidth;
	var wh = window.innerHeight;
	var cw = canvas.width;
	var ch = canvas.height;

	if (ww >= cw && wh >= ch) {
		return;
	} else if (ww < cw && wh >= ch) {
		wh = ((ww / cw) * ch) | 0;
		canvas.style.width = ww + "px";
		canvas.style.height = wh + "px";
	} else if (ww >= cw && wh < ch) {
		ww = ((wh / ch) * cw) | 0;
		canvas.style.width = ww + "px";
		canvas.style.height = wh + "px";
	} else if (ww < cw && wh < ch) {
		if ((ww / cw) * ch > wh) {
			ww = ((wh / ch) * cw) | 0;
		} else {
			wh = ((ww / cw) * ch) | 0;
		}
		canvas.style.width = ww + "px";
		canvas.style.height = wh + "px";
	}
}

class Game {	
	/**
	 * The mouse input for the game.
	 * @member {Mouse}
	 */
	mouse: Mouse;
		
	/**
	 * The animation assets for the game.
	 * @member {AnimationLoader}
	 */
	animations: AnimationLoader;
	
	/**
	 * The keyboard input for the game.
	 * @member {Keyboard}
	 */
	keyboard = new Keyboard(keyMap['US']);
	/**
	 * The accelerometer input for the game.
	 * @member {Accelerometer}
	 */
	accelerometer = new Accelerometer();
	
	/**
	 * The image assets for the game.
	 * @member {ImageLoader}
	 */
	images = new ImageLoader();
	
	/**
	 * The sound assets for the game.
	 * @member {SoundLoader}
	 */
	sounds = new SoundLoader();
	
	/**
	 * The font assets for the game.
	 * @member {FontLoader}
	 */
	fonts = new FontLoader();

	/**
	 * The scenes for the game.
	 * @member {SceneManager}
	 */
	scenes = new SceneManager();
	
	/**
	 * Represents a whole game. This class contains all the inputs, outputs, and data for the game.
	 * @constructor
	 * @alias Splat.Game
	 * @param {external:canvas} canvas The canvas on which to render the game.
	 * @param {object} manifest A key-value set of attributes that describe all the external resources for the game. This references all the images, sounds, fonts, and animations.
	 * @example
		var canvas = document.getElementById("canvas");
		var manifest = {
			"images": {
				"bg": "images/bg.png"
			},
			"sounds": {
				"point": "sounds/point.wav"
			},
			"fonts": [
				"pixelade": {
					"embedded-opentype": "pixelade/pixelade-webfont.eot",
					"woff": "pixelade/pixelade-webfont.woff",
					"truetype": "pixelade/pixelade-webfont.ttf",
					"svg": "pixelade/pixelade-webfont.svg#pixeladeregular"
				}
			],
			"animations": {
				"player-slide-left": {
					"strip": "images/player-slide-anim.png",
					"frames": 8,
					"msPerFrame": 100
				}
			}
		};
		var game = new Splat.Game(canvas, manifest);
	 */
	constructor(canvas: HTMLCanvasElement, manifest: GameManifest) {
		window.addEventListener("resize", function() { setCanvasSizeScaled(canvas); });
		setCanvasSizeScaled(canvas);
	
		var wasMuted = false;
		window.addEventListener("visibilitychange", () => {
			var scene = this.scenes.currentScene;
			if (typeof scene.visibilitychange === "function") {
				scene.visibilitychange(document.visibilityState);
				return;
			}
			if (document.visibilityState === "hidden") {
				scene.stop();
				wasMuted = this.sounds.isMuted();
				this.sounds.mute();
			} else {
				scene.start();
				if (!wasMuted) {
					this.sounds.unmute();
				}
			}
		});
	
		this.mouse = new Mouse(canvas);
		loadAssets(this.images, manifest.images);
		loadAssets(this.sounds, manifest.sounds);
	
		this.fonts.load(manifest.fonts);
		this.animations = new AnimationLoader(this.images, manifest.animations);
		this.scenes.add("loading", makeLoadingScene(this, canvas, "title"));
	}
	
	/**
	 * Test if all the game's assets are loaded.
	 * @returns {boolean}
	 */
	isLoaded() {
		return this.images.allLoaded() &&
			this.sounds.allLoaded() &&
			this.fonts.allLoaded() &&
			this.animations.allLoaded();
	}
	
	/**
	 * Determine the percent of the game's assets that are loaded. This is useful for drawing a loading bar.
	 * @returns {number} A number between 0 and 1
	 */
	percentLoaded() {
		var totalAssets =
			this.images.totalImages +
			this.sounds.totalSounds +
			this.fonts.totalFonts;
		var loadedAssets =
			this.images.loadedImages +
			this.sounds.loadedSounds +
			this.fonts.loadedFonts;
		return loadedAssets / totalAssets;
	}
	
	/**
	 * Test if the game is running within a Chrome App.
	 * @returns {boolean}
	 */
	isChromeApp() {
		return platform.isChromeApp();
	}
}

export = Game;
