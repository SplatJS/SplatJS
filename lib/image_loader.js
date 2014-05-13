"use strict";

/**
 * Loads {@link external:image}s and lets you know when they're all available. This is typically handled for you by {@link Game}.
 * @constructor
 */
function ImageLoader() {
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
	});
	img.addEventListener("error", function() {
		console.error("Error loading image " + path);
	});
	img.src = path;
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
	var img = this.images[name];
	if (img === undefined) {
		console.error("Unknown image: " + name);
	}
	return img;
};

module.exports = ImageLoader;
