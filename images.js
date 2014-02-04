var Splat = (function(splat, window) {

	function ImageLoader() {
		this.images = {};
		this.totalImages = 0;
		this.loadedImages = 0;
		this.names = [];
	}
	ImageLoader.prototype.load = function(name, path) {
		// only load an image once
		if (this.names.indexOf(name) > -1) {
			return;
		}
		this.names.push(name);

		this.totalImages++;

		var img = new Image();
		var that = this;
		img.addEventListener("load", function() {
			that.loadedImages++;
			that.images[name] = img;
		});
		img.addEventListener("error", function() {
			console.error("Error loading image " + path);
		});
		img.src = path;
	};
	ImageLoader.prototype.allLoaded = function() {
		return this.totalImages == this.loadedImages;
	};
	ImageLoader.prototype.get = function(name) {
		var img = this.images[name];
		if (img === undefined) {
			console.error("Unknown image: " + name);
		}
		return img;
	};

	splat.ImageLoader = ImageLoader;
	return splat;

}(Splat || {}, window));
