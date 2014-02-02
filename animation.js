var Splat = (function(splat, window, document) {

	function Animation() {
		this.frames = [];
		this.frame = 0;
		this.elapsedMillis = 0;
		this.repeatAt = 0;
		this.width = 0;
		this.height = 0;
	}
	Animation.prototype.add = function(img, time) {
		this.frames.push({img: img, time: time});
		if (frames.length === 0) {
			this.width = img.width;
			this.height = img.height;
		}
	};
	Animation.prototype.move = function(elapsedMillis) {
		this.elapsedMillis += elapsedMillis;
		while (this.elapsedMillis > this.frames[this.frame].time) {
			this.elapsedMillis -= this.frames[this.frame].time;
			this.frame++;
			if (this.frame >= this.frames.length) {
				this.frame = this.repeatAt;
			}
		}
	};
	Animation.prototype.draw = function(context, x, y) {
		var img = this.frames[this.frame].img;
		context.drawImage(img, x, y);
	};
	Animation.prototype.reset = function() {
		this.frame = 0;
		this.elapsedMillis = 0;
	};

	function makeFrame(img, frameWidth, f) {
		return splat.makeBuffer(frameWidth, img.height, function(ctx) {
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

	function loadImagesFromManifest(imageLoader, manifest) {
		for (var key in manifest) {
			if (manifest.hasOwnProperty(key)) {
				var info = manifest[key];
				if (info.strip !== undefined) {
					imageLoader.load(key, info.strip);
				} else if (info.prefix !== undefined) {
					for (var i = 1; i <= info.frames; i++) {
						var name = info.prefix + i + info.suffix;
						imageLoader.load(key + i, name);
					}
				}
			}
		}
	}
	function AnimationLoader(imageLoader, manifest) {
		this.imageLoader = imageLoader;
		this.manifest = manifest;
		loadImagesFromManifest(imageLoader, manifest);
	}
	function makeAnimationFromManifest(images, key, manifestEntry) {
		if (manifestEntry.strip !== undefined) {
			var img = images.get(key);
			return makeAnimation(img, manifestEntry.frames, manifestEntry.msPerFrame);
		} else if (manifestEntry.prefix !== undefined) {
			var a = new Animation();
			for (var i = 1; i <= manifestEntry.frames; i++) {
				var img = images.get(key + i);
				a.add(img, manifestEntry.msPerFrame);
			}
			return a;
		}
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
	AnimationLoader.prototype.allLoaded = function() {
		if (this.animations !== undefined) {
			return true;
		}
		var loaded = this.imageLoader.allLoaded();
		if (loaded) {
			this.animations = generateAnimationsFromManifest(this.imageLoader, this.manifest);
		}
		return loaded;
	};
	AnimationLoader.prototype.get = function(name) {
		return this.animations[name];
	}

	splat.Animation = Animation;
	splat.makeAnimation = makeAnimation;
	splat.AnimationLoader = AnimationLoader;
	return splat;

}(Splat || {}, window, document));
