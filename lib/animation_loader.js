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

function AnimationLoader(imageLoader, manifest) {
	this.imageLoader = imageLoader;
	this.manifest = manifest;
	loadImagesFromManifest(imageLoader, manifest);
}
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
AnimationLoader.prototype.load = function(name, info) {
	this.manifest[name] = info;
	this.loaded = false;
	loadImageFromManifest(this.imageLoader, name, info);
};
AnimationLoader.prototype.get = function(name) {
	var anim = this.animations[name];
	if (anim === undefined) {
		console.error("Unknown animation: " + name);
	}
	return anim;
};

module.exports = AnimationLoader;
