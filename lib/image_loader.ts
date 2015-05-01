"use strict";

class ImageLoader {
	/**
	 * The key-value object that stores named {@link external:image}s
	 * @member {object}
	 * @private
	 */
	images: { [name: string]: any } = {};
	/**
	 * The total number of images to be loaded.
	 * @member {number}
	 * @private
	 */
	totalImages = 0;
	/**
	 * The number of images that have loaded completely.
	 * @member {number}
	 * @private
	 */
	loadedImages = 0;
	/**
	 * The names of all the images that were requested to be loaded.
	 * @member {Array}
	 * @private
	 */
	names: string[] = [];
		
	/**
	 * Loads {@link external:image}s and lets you know when they're all available. An instance of ImageLoader is available as {@link Splat.Game#images}.
	 * @constructor
	 */
	constructor() {
	}
	
	/**
	 * Load an {@link external:image}.
	 * @param {string} name The name you want to use when you {@link ImageLoader#get} the {@link external:image}
	 * @param {string} path The path of the {@link external:image}.
	 */
	load(name: string, path: string) {
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
	}
	
	/**
	 * Test if all {@link external:image}s have loaded.
	 * @returns {boolean}
	 */
	allLoaded() {
		return this.totalImages === this.loadedImages;
	}
	
	/**
	 * Retrieve a loaded {@link external:image}.
	 * @param {string} name The name given to the image during {@link ImageLoader#load}.
	 * @returns {external:image}
	 */
	get(name: string) {
		var img = this.images[name];
		if (img === undefined) {
			console.error("Unknown image: " + name);
		}
		return img;
	};
}

export = ImageLoader;
