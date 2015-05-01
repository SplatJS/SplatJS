"use strict";

import buffer = require("./buffer");
import Animation = require("./animation");

interface AnimationManifestItem {
	strip?: string;
	frames: number;
	msPerFrame: number;
	flip?: string;
	prefix?: string;
	suffix?: string;
	padNumberTo?: number;
	repeatAt?: number;
	rotate?: string;
}

interface AnimationManifest {
	[name: string]: AnimationManifestItem;
}

function makeFrame(img: any, frameWidth: number, f: number) {
	return buffer.makeBuffer(frameWidth, img.height, function(ctx: CanvasRenderingContext2D) {
		var sx = f * frameWidth;
		ctx.drawImage(img, sx, 0, frameWidth, img.height, 0, 0, frameWidth, img.height);
	});
}

function makeAnimation(img: any, numFrames: number, time: number) {
	var a = new Animation();
	var frameWidth = img.width / numFrames |0;
	for (var f = 0; f < numFrames; f++) {
		a.add(makeFrame(img, frameWidth, f), time);
	}
	return a;
}

function loadImageFromManifest(imageLoader: any, name: string, info: AnimationManifestItem) {
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

function loadImagesFromManifest(imageLoader: any, manifest: AnimationManifest) {
	for (var key in manifest) {
		if (manifest.hasOwnProperty(key)) {
			var info = manifest[key];
			loadImageFromManifest(imageLoader, key, info);
		}
	}
}

function makeAnimationFromManifest(images: any, key: string, manifestEntry: AnimationManifestItem) {
	var animation: Animation;
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
	if (manifestEntry.rotate === "cw") {
		animation.rotateClockwise();
	}
	if (manifestEntry.rotate === "180") {
		animation.rotateClockwise().rotateClockwise();
	}
	if (manifestEntry.rotate === "ccw") {
		animation.rotateCounterclockwise();
	}
	animation.name = key;
	return animation;
}

function generateAnimationsFromManifest(images: any, manifest: AnimationManifest) {
	var animations: any = {};
	for (var key in manifest) {
		if (manifest.hasOwnProperty(key)) {
			var info = manifest[key];
			animations[key] = makeAnimationFromManifest(images, key, info);
		}
	}
	return animations;
}

class AnimationLoader {
	/**
	* The ImageLoader used to fetch all {@link external:image}s.
	* @member {ImageLoader}
	*/
	imageLoader: any;
	/**
	* The list of {@link Animation} metadata.
	* @member {object}
	*/
	manifest: AnimationManifest;
	
	/**
	 * Loads and constructs {@link Animation}s from a manifest. An instance of AnimationLoader is available as {@link Splat.Game#animations}.
	 * @constructor
	 * @param {ImageLoader} imageLoader The ImageLoader used to fetch all {@link external:image}s.
	 * @param {object} manifest The list of {@link Animation}s to build.
	 * @example
		var manifest = {
			"player-left": { // The Animation's name
				"strip": "img/player-left.png", // The path to a sprite-strip. A sprite strip is multiple frames side-by-side horizontally in a single image.
				"frames": 4, // The number of frames in the Animation
				"msPerFrame": 100 // How many milliseconds to display each frame
			},
			"player-right": {
				"strip": "img/player-left.png", // Re-use the left sprite-strip
				"frames": 4,
				"msPerFrame": 100,
				"flip": "horizontal" // Flip the animation horizontally so we can use the left image for the right.
			},
			"item": { // Create an animation from individual images named "img/item/[0000-0009].png"
				"prefix": "img/item/", // Image filename prefix
				"suffix": ".png", // Image filename suffix
				"padNumberTo": 4, // Number part of image is 4 characters long.
				"frames": 10, // Load 10 separate image files [0-9].
				"msPerFrame": 100,
				"repeatAt": 5, // Loop the animation back at frame 5.
				"rotate": "cw" // Rotate the animation clockwise.
			}
		};
		var imageLoader = new Splat.ImageLoader();
		var animationLoader = new Splat.AnimationLoader(imageLoader, manifest);
	 */
	constructor(imageLoader: any, manifest: AnimationManifest) {
		this.imageLoader = imageLoader;
		this.manifest = manifest;
		loadImagesFromManifest(imageLoader, manifest);
	}
	
	private loaded = false;
	private animations: any;
	/**
	 * Test if all {@link Animation}s are loaded.
	 * @returns {boolean}
	 */
	allLoaded() {
		if (this.loaded) {
			return true;
		}
		var loaded = this.imageLoader.allLoaded();
		if (loaded) {
			this.animations = generateAnimationsFromManifest(this.imageLoader, this.manifest);
			this.loaded = true;
		}
		return loaded;
	}
	
	/**
	 * Load a single {@link Animation}.
	 * @param {string} name The name to store the {@link Animation} under. This name will be used to retrieve the Animation from {@link AnimationLoader#get}.
	 * @param {object} info A single-animation portion of {@link AnimationLoader#manifest}.
	 */
	load(name: string, info: AnimationManifestItem) {
		this.manifest[name] = info;
		this.loaded = false;
		loadImageFromManifest(this.imageLoader, name, info);
	}
	
	/**
	 * Fetch a loaded {@link Animation}.
	 * @param {string} name The name used to identify the {@link Animation} in the {@link AnimationLoader#manifest}.
	 * @returns {Animation}
	 */
	get(name: string) {
		var anim = this.animations[name];
		if (anim === undefined) {
			console.error("Unknown animation: " + name);
		}
		return anim;
	}
}

export = AnimationLoader;
