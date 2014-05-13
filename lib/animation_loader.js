"use strict";

var buffer = require("./buffer");
var Animation = require("./animation");

function makeFrame(img, frameWidth, f) {
	return buffer.makeBuffer(frameWidth, img.height, function(ctx) {
		var sx = f * frameWidth;
		ctx.drawImage(img, sx, 0, frameWidth, img.height, 0, 0, frameWidth, img.height);
	});
}

function makeAnimation(img, numFrames, time) {
	var a = new Animation();
	var frameWidth = img.width / numFrames |0;
	for (var f = 0; f < numFrames; f++) {
		a.add(makeFrame(img, frameWidth, f), time);
	}
	return a;
}

function loadImageFromManifest(imageLoader, name, info) {
	if (info.strip !== undefined) {
		imageLoader.load(name, info.strip);
	} else if (info.prefix !== undefined) {
		for (var i = 1; i <= info.frames; i++) {
			var number = "" + i;
			if (info.padNumberTo > 1) {
				while (number.length < info.padNumberTo) {
					number = "0" + number;
				}
			}
			name = info.prefix + number + info.suffix;
			imageLoader.load(name + i, name);
		}
	}
}

function loadImagesFromManifest(imageLoader, manifest) {
	for (var key in manifest) {
		if (manifest.hasOwnProperty(key)) {
			var info = manifest[key];
			loadImageFromManifest(imageLoader, key, info);
		}
	}
}

function makeAnimationFromManifest(images, key, manifestEntry) {
	var animation;
	if (manifestEntry.strip !== undefined) {
		var strip = images.get(key);
		animation = makeAnimation(strip, manifestEntry.frames, manifestEntry.msPerFrame);
	} else if (manifestEntry.prefix !== undefined) {
		animation = new Animation();
		for (var i = 1; i <= manifestEntry.frames; i++) {
			var frame = images.get(key + i);
			animation.add(frame, manifestEntry.msPerFrame);
		}
	}
	if (manifestEntry.repeatAt !== undefined) {
		animation.repeatAt = manifestEntry.repeatAt;
	}
	if (manifestEntry.flip === "horizontal") {
		animation.flipHorizontally();
	}
	if (manifestEntry.flip === "vertical") {
		animation.flipVertically();
	}
	animation.name = key;
	return animation;
}

function generateAnimationsFromManifest(images, manifest) {
	var animations = {};
	for (var key in manifest) {
		if (manifest.hasOwnProperty(key)) {
			var info = manifest[key];
			animations[key] = makeAnimationFromManifest(images, key, info);
		}
	}
	return animations;
}

/**
 * Loads and constructs {@link Animation}s from a manifest. This is typically handled for you by {@link Game}.
 * @constructor
 * @param {ImageLoader} imageLoader The ImageLoader used to fetch all {@link external:image}s.
 * @param {object} manifest The list of {@link Animation}s to build.
 * @example
 * var manifest = {
 * 	"player-left": { // The Animation's name
 * 		"strip": "img/player-left.png", // The path to a sprite-strip. A sprite strip is multiple frames side-by-side horizontally in a single image.
 * 		"frames": 4, // The number of frames in the Animation
 * 		"msPerFrame": 100 // How many milliseconds to display each frame
 * 	},
 * 	"player-right": {
 * 		"strip": "img/player-left.png", // Re-use the left sprite-strip
 * 		"frames": 4,
 * 		"msPerFrame": 100,
 * 		"flip": "horizontal" // Flip the animation horizontally so we can use the left image for the right.
 * 	},
 * 	"item": { // Create an animation from individual images named "img/item/[0000-0009].png"
 * 		"prefix": "img/item/", // Image filename prefix
 * 		"suffix": ".png", // Image filename suffix
 * 		"padNumberTo": 4, // Number part of image is 4 characters long.
 * 		"frames": 10, // Load 10 separate image files [0-9].
 * 		"msPerFrame": 100,
 * 		"repeatAt": 5, // Loop the animation back at frame 5.
 * 	}
 * };
 * var imageLoader = new Splat.ImageLoader();
 * var animationLoader = new Splat.AnimationLoader(imageLoader, manifest);
 */
function AnimationLoader(imageLoader, manifest) {
	/**
	 * The ImageLoader used to fetch all {@link external:image}s.
	 * @member {ImageLoader}
	 */
	this.imageLoader = imageLoader;
	/**
	 * The list of {@link Animation} metadata.
	 * @member {object}
	 */
	this.manifest = manifest;
	loadImagesFromManifest(imageLoader, manifest);
}
/**
 * Test if all {@link Animation}s are loaded.
 * @returns {boolean}
 */
AnimationLoader.prototype.allLoaded = function() {
	if (this.loaded) {
		return true;
	}
	var loaded = this.imageLoader.allLoaded();
	if (loaded) {
		this.animations = generateAnimationsFromManifest(this.imageLoader, this.manifest);
		this.loaded = true;
	}
	return loaded;
};
/**
 * Load a single {@link Animation}.
 * @param {string} name The name to store the {@link Animation} under. This name will be used to retrieve the Animation from {@link AnimationLoader#get}.
 * @param {object} info A single-animation portion of {@link AnimationLoader#manifest}.
 */
AnimationLoader.prototype.load = function(name, info) {
	this.manifest[name] = info;
	this.loaded = false;
	loadImageFromManifest(this.imageLoader, name, info);
};
/**
 * Fetch a loaded {@link Animation}.
 * @param {string} name The name used to identify the {@link Animation} in the {@link AnimationLoader#manifest}.
 * @returns {Animation}
 */
AnimationLoader.prototype.get = function(name) {
	var anim = this.animations[name];
	if (anim === undefined) {
		console.error("Unknown animation: " + name);
	}
	return anim;
};

module.exports = AnimationLoader;
