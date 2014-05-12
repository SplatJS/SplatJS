"use strict";

var buffer = require("./buffer");

/**
 * An animated picture made of multiple images.
 * @constructor
 */
function Animation() {
	/**
	 * The individual frames making up the animation.
	 * @member {Array}
	 * @private
	 */
	this.frames = [];
	/**
	 * The currently displayed frame of the animation.
	 * @member {number}
	 */
	this.frame = 0;
	/**
	 * How long, in milliseconds, the current frame has been displayed for.
	 * @member {number}
	 * @private
	 */
	this.elapsedMillis = 0;
	/**
	 * The frame at which to restart the animation after the last frame plays. It defaults to 0, so animations loop. If you want to disable looping, set this to the last frame. Otherwise, you can set it to one of the middle frames to have non-repeating introductory frames, while having looping later frames.
	 * @member {number}
	 */
	this.repeatAt = 0;
	/**
	 * The width of the first frame of the animation.
	 * @member {number}
	 * @readonly
	 */
	this.width = 0;
	/**
	 * The height of the first frame of the animation.
	 * @member {number}
	 * @readonly
	 */
	this.height = 0;
}
/**
 * Add a frame to the animation.
 * @param {external:canvas|external:image} img The image to draw for the frame being added.
 * @param {number} time How long, in milliseconds this frame should be displayed in the animation.
 */
Animation.prototype.add = function(img, time) {
	this.frames.push({img: img, time: time});
	if (this.frames.length === 1) {
		this.width = img.width;
		this.height = img.height;
	}
};
/**
 * Advance the animation by a single frame.
 */
Animation.prototype.step = function() {
	this.frame++;
	if (this.frame >= this.frames.length) {
		this.frame = this.repeatAt;
	}
};
/**
 * Advance the animation by a number of milliseconds.
 * @param {number} elapsedMillis How many milliseconds to advance the animation by.
 */
Animation.prototype.move = function(elapsedMillis) {
	this.elapsedMillis += elapsedMillis;
	while (this.elapsedMillis > this.frames[this.frame].time) {
		this.elapsedMillis -= this.frames[this.frame].time;
		this.step();
	}
};
/**
 * Draw the current frame of the animation.
 * @param {external:CanvasRenderingContext2D} context The drawing context.
 * @param {number} x The x coordinate to draw the animation at.
 * @param {number} y The y coordinate to draw the animation at.
 */
Animation.prototype.draw = function(context, x, y) {
	var img = this.frames[this.frame].img;
	context.drawImage(img, x, y);
};
/**
 * Reset the animation to the first frame. This can be useful when you have one piece of code calling {@link Animation#move} each frame, but you want the animation to appear stopped.
 */
Animation.prototype.reset = function() {
	this.frame = 0;
	this.elapsedMillis = 0;
};
/**
 * Flip all frames in the animation horizontally. Useful when you want to use a single set of images for left and right animations.
 */
Animation.prototype.flipHorizontally = function() {
	for (var i = 0; i < this.frames.length; i++) {
		this.frames[i].img = buffer.flipBufferHorizontally(this.frames[i].img);
	}
};
/**
 * Flip all frames in the animation vertically. Useful when you want to use a single set of images for up and down animations.
 */
Animation.prototype.flipVertically = function() {
	for (var i = 0; i < this.frames.length; i++) {
		this.frames[i].img = buffer.flipBufferVertically(this.frames[i].img);
	}
};

module.exports = Animation;
