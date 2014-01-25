var Splat = (function(splat, window, document) {

	function getContextForImage(image) {
		var ctx;
		var canvas = splat.makeBuffer(image.width, image.height, function(context) {
			context.drawImage(image, 0, 0, image.width, image.height);
			ctx = context;
		});
		return ctx;
	}

	function NinePatch(image) {
		this.img = image;
		var imgw = image.width - 1;
		var imgh = image.height - 1;

		var context = getContextForImage(image);
		var firstDiv = imgw;
		var secondDiv = imgw;
		var pixel;
		var alpha;
		for (var x = 0; x < imgw; x++) {
			pixel = context.getImageData(x, imgh, 1, 1).data;
			alpha = pixel[3];
			if (firstDiv == imgw && alpha > 0) {
				firstDiv = x;
			}
			if (firstDiv < imgw && alpha === 0) {
				secondDiv = x;
				break;
			}
		}
		this.w1 = firstDiv;
		this.w2 = secondDiv - firstDiv;
		this.w3 = imgw - secondDiv;

		firstDiv = secondDiv = imgh;
		for (var y = 0; y < imgh; y++) {
			pixel = context.getImageData(imgw, y, 1, 1).data;
			alpha = pixel[3];
			if (firstDiv == imgh && alpha > 0) {
				firstDiv = y;
			}
			if (firstDiv < imgh && alpha === 0) {
				secondDiv = y;
				break;
			}
		}
		this.h1 = firstDiv;
		this.h2 = secondDiv - firstDiv;
		this.h3 = imgh - secondDiv;
	}
	NinePatch.prototype.draw = function(context, x, y, width, height) {
		x = x|0;
		y = y|0;
		width = width |0;
		height = height |0;
		var cx, cy, w, h;

		for (cy = y + this.h1; cy < y + height - this.h3; cy += this.h2) {
			for (cx = x + this.w1; cx < x + width - this.w3; cx += this.w2) {
				w = Math.min(this.w2, x + width - this.w3 - cx);
				h = Math.min(this.h2, y + height - this.h3 - cy);
				context.drawImage(this.img, this.w1, this.h1, w, h, cx, cy, w, h);
			}
		}
		for (cy = y + this.h1; cy < y + height - this.h3; cy += this.h2) {
			h = Math.min(this.h2, y + height - this.h3 - cy);
			if (this.w1 > 0) {
				context.drawImage(this.img, 0,                 this.h1, this.w1, h, x,                   cy, this.w1, h);
			}
			if (this.w3 > 0) {
				context.drawImage(this.img, this.w1 + this.w2, this.h1, this.w3, h, x + width - this.w3, cy, this.w3, h);
			}
		}
		for (cx = x + this.w1; cx < x + width - this.w3; cx += this.w2) {
			w = Math.min(this.w2, x + width - this.w3 - cx);
			if (this.h1 > 0) {
				context.drawImage(this.img, this.w1, 0,                 w, this.h1, cx, y,                    w, this.h1);
			}
			if (this.h3 > 0) {
				context.drawImage(this.img, this.w1, this.w1 + this.w2, w, this.h3, cx, y + height - this.h3, w, this.h3);
			}
		}
		if (this.w1 > 0 && this.h1 > 0) {
			context.drawImage(this.img, 0, 0, this.w1, this.h1, x, y, this.w1, this.h1);
		}
		if (this.w3 > 0 && this.h1 > 0) {
			context.drawImage(this.img, this.w1 + this.w2, 0, this.w3, this.h1, x + width - this.w3, y, this.w3, this.h1);
		}
		if (this.w1 > 0 && this.h3 > 0) {
			context.drawImage(this.img, 0, this.h1 + this.h2, this.w1, this.h3, x, y + height - this.h3, this.w1, this.h3);
		}
		if (this.w3 > 0 && this.h3 > 0) {
			context.drawImage(this.img, this.w1 + this.w2, this.h1 + this.h2, this.w3, this.h3, x + width - this.w3, y + height - this.h3, this.w3, this.h3);
		}
	};

	splat.NinePatch = NinePatch;
	return splat;

}(Splat || {}, window, document));
