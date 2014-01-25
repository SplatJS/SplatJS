var Splat = (function(splat, window, document) {

	function loadAssets(assetLoader, assets) {
		for (var key in assets) {
			if (assets.hasOwnProperty(key)) {
				assetLoader.load(key, assets[key]);
			}
		}
	}

	function Game(canvas, manifest) {
		this.mouse = new splat.MouseInput(canvas);
		this.keyboard = new splat.KeyboardInput(splat.keyMap.US);

		this.images = new splat.ImageLoader();
		loadAssets(this.images, manifest.images);

		this.sounds = new splat.SoundLoader();
		loadAssets(this.sounds, manifest.sounds);

		this.fonts = new splat.FontLoader();
		this.fonts.load(manifest.fonts);

		var that = this;
		this.isLoaded = function() {
			return this.images.allLoaded() && this.sounds.allLoaded() && this.fonts.allLoaded();
		};
	}

	splat.Game = Game;
	return splat;

}(Splat || {}, window, document));
