"use strict";

/**
 * Loads {@link external:image}s and lets you know when they're all available. An instance of ImageLoader is available as {@link Splat.Game#images}.
 * @constructor
 */
function ImageLoader(onLoad) {
	/**
	 * The key-value object that stores named {@link external:image}s
	 * @member {object}
	 * @private
	 */
	this.images = {};
	/**
	 * The total number of images to be loaded.
	 * @member {number}
	 * @private
	 */
	this.totalImages = 0;
	/**
	 * The number of images that have loaded completely.
	 * @member {number}
	 * @private
	 */
	this.loadedImages = 0;
	/**
	 * The names of all the images that were requested to be loaded.
	 * @member {Array}
	 * @private
	 */
	this.names = [];
	/**
	 * A callback to be called once all images are loaded.
	 * @member {Array}
	 * @private
	 */
	this.onLoad = onLoad;
}
/**
 * Load an {@link external:image}.
 * @param {string} name The name you want to use when you {@link ImageLoader#get} the {@link external:image}
 * @param {string} path The path of the {@link external:image}.
 */
ImageLoader.prototype.load = function(name, path) {
	// only load an image once
	if (this.names.indexOf(name) > -1) {
		return;
	}
	this.names.push(name);

	this.totalImages++;

	var img = new Image();
	var self = this;
	img.addEventListener("load", function() {
		self.loadedImages++;
		self.images[name] = img;
		if (this.allLoaded() && self.onLoad) {
			self.onLoad();
		}
	});
	img.addEventListener("error", function() {
		console.error("Error loading image " + path);
	});
	img.src = path;
};
ImageLoader.prototype.loadFromManifest = function(manifest) {
	var keys = Object.keys(manifest);
	var self = this;
	keys.forEach(function(key) {
		self.load(key, manifest[key]);
	});
};

/**
 * Test if all {@link external:image}s have loaded.
 * @returns {boolean}
 */
ImageLoader.prototype.allLoaded = function() {
	return this.totalImages === this.loadedImages;
};
/**
 * Retrieve a loaded {@link external:image}.
 * @param {string} name The name given to the image during {@link ImageLoader#load}.
 * @returns {external:image}
 */
ImageLoader.prototype.get = function(name) {
	return this.images[name];
};

module.exports = ImageLoader;
