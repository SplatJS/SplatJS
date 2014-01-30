var Splat = (function(splat, window) {

	function ImageLoader() {
		this.images = {};
		this.totalImages = 0;
		this.loadedImages = 0;
	}
	ImageLoader.prototype.load = function(name, path) {
		this.totalImages++;

		var img = new Image();
		var that = this;
		img.addEventListener("load", function() {
			that.loadedImages++;
			that.images[name] = img;
		});
		img.src = path;
	};
	ImageLoader.prototype.allLoaded = function() {
		return this.totalImages == this.loadedImages;
	};
	ImageLoader.prototype.get = function(name) {
		return this.images[name];
	};

	splat.ImageLoader = ImageLoader;
	return splat;

}(Splat || {}, window));
