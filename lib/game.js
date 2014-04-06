"use strict";

var Scene = require("./scene");
var Mouse = require("./mouse");
var Accelerometer = require("./accelerometer");
var Keyboard = require("./keyboard");
var keyMap = require("./key_map");
var ImageLoader = require("./image_loader");
var SoundLoader = require("./sound_loader");
var FontLoader = require("./font_loader");
var AnimationLoader = require("./animation_loader");
var SceneManager = require("./scene_manager");

function loadAssets(assetLoader, assets) {
	for (var key in assets) {
		if (assets.hasOwnProperty(key)) {
			assetLoader.load(key, assets[key]);
		}
	}
}

function makeLoadingScene(game, canvas, nextScene) {
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

function setCanvasSizeScaled(canvas) {
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

function setCanvasSizeFullScreen(canvas) {
	canvas.width = window.innerWidth * window.devicePixelRatio;
	canvas.height = window.innerHeight * window.devicePixelRatio;
	canvas.style.width = window.innerWidth + "px";
	canvas.style.height = window.innerHeight + "px";
}

function Game(canvas, manifest) {
	if (window.ejecta) {
		setCanvasSizeFullScreen(canvas);
	} else {
		window.addEventListener("resize", function() { setCanvasSizeScaled(canvas); });
		setCanvasSizeScaled(canvas);
	}

	this.mouse = new Mouse(canvas);
	this.keyboard = new Keyboard(keyMap.US);

	this.accelerometer = new Accelerometer(canvas);

	this.images = new ImageLoader();
	loadAssets(this.images, manifest.images);

	this.sounds = new SoundLoader();
	loadAssets(this.sounds, manifest.sounds);

	this.fonts = new FontLoader();
	this.fonts.load(manifest.fonts);

	this.animations = new AnimationLoader(this.images, manifest.animations);

	this.scenes = new SceneManager();
	this.scenes.add("loading", makeLoadingScene(this, canvas, "title"));
}
Game.prototype.isLoaded = function() {
	return this.images.allLoaded() &&
		this.sounds.allLoaded() &&
		this.fonts.allLoaded() &&
		this.animations.allLoaded();
};
Game.prototype.percentLoaded = function() {
	var totalAssets =
		this.images.totalImages +
		this.sounds.totalSounds +
		this.fonts.totalFonts;
	var loadedAssets =
		this.images.loadedImages +
		this.sounds.loadedSounds +
		this.fonts.loadedFonts;
	return loadedAssets / totalAssets;
};
Game.prototype.isChromeApp = function() {
	return window.chrome && window.chrome.app && window.chrome.app.runtime;
};

module.exports = Game;
