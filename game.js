var Splat = (function(splat, window, document) {

	function loadAssets(assetLoader, assets) {
		for (var key in assets) {
			if (assets.hasOwnProperty(key)) {
				assetLoader.load(key, assets[key]);
			}
		}
	}

	function makeLoadingScene(game, canvas, nextScene) {
		return new splat.Scene(canvas, function() {
		}, function(elapsedMillis) {
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

	function setCanvasSize() {
		var ow = 1136;
		var oh = 640;

		var w = Math.min(window.innerWidth, ow);
		var h = Math.min(window.innerHeight, oh);
		canvas.style.width = w + "px";
		canvas.style.height = h + "px";

		if (w != ow || h != oh) {
			canvas.width = oh / window.innerHeight * window.innerWidth;
			canvas.height = oh;
		}

		// console.log(window.innerWidth + "x" + window.innerHeight + " - " + canvas.style.width + "x" + canvas.style.height + " - " + canvas.width + "x" + canvas.height);
	}

	function Game(canvas, manifest) {
		window.addEventListener("resize", setCanvasSize);
		setCanvasSize();

		this.mouse = new splat.MouseInput(canvas);
		this.keyboard = new splat.KeyboardInput(splat.keyMap.US);

		this.images = new splat.ImageLoader();
		loadAssets(this.images, manifest.images);

		this.sounds = new splat.SoundLoader();
		loadAssets(this.sounds, manifest.sounds);

		this.fonts = new splat.FontLoader();
		this.fonts.load(manifest.fonts);

		this.animations = new splat.AnimationLoader(this.images, manifest.animations);

		this.scenes = new splat.SceneManager();
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

	splat.Game = Game;
	return splat;

}(Splat || {}, window, document));
