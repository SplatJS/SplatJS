"use strict";

import buffer = require("./buffer");

function getContextForImage(image: any) {
	var ctx: CanvasRenderingContext2D;
	buffer.makeBuffer(image.width, image.height, function(context) {
		context.drawImage(image, 0, 0, image.width, image.height);
		ctx = context;
	});
	return ctx;
}

class NinePatch {
	img: any;
	w1: number;
	w2: number;
	w3: number;
	h1: number;
	h2: number;
	h3: number;
	/**
	 * A stretchable image that has borders.
	 * Similar to the [Android NinePatch]{@link https://developer.android.com/guide/topics/graphics/2d-graphics.html#nine-patch}, but it only has the lines on the bottom and right edges to denote the stretchable area.
	 * A NinePatch is a normal picture, but has an extra 1-pixel wide column on the right edge and bottom edge. The extra column contains a black line that denotes the tileable center portion of the image. The lines are used to divide the image into nine tiles that can be automatically repeated to stretch the picture to any size without distortion.
	 * @constructor
	 * @alias Splat.NinePatch
	 * @param {external:image} image The source image to make stretchable.
	 */
	constructor(image: any) {
		this.img = image;
		var imgw = image.width - 1;
		var imgh = image.height - 1;
	
		var context = getContextForImage(image);
		var firstDiv = imgw;
		var secondDiv = imgw;
		var pixel: number[];
		var alpha: number;
		for (var x = 0; x < imgw; x++) {
			pixel = context.getImageData(x, imgh, 1, 1).data;
			alpha = pixel[3];
			if (firstDiv === imgw && alpha > 0) {
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
			if (firstDiv === imgh && alpha > 0) {
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
	
	/**
	 * Draw the image stretched to a given rectangle.
	 * @param {external:CanvasRenderingContext2D} context The drawing context.
	 * @param {number} x The left side of the rectangle.
	 * @param {number} y The top of the rectangle.
	 * @param {number} width The width of the rectangle.
	 * @param {number} height The height of the rectangle.
	 */
	draw(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
		x = x|0;
		y = y|0;
		width = width |0;
		height = height |0;
		var cx: number, cy: number, w: number, h: number;
	
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
	}
}

export = NinePatch;
