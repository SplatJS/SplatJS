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

	splat.Animation = Animation;
	splat.makeAnimation = makeAnimation;
	return splat;

}(Splat || {}, window, document));
