"use strict";

import buffer = require("./buffer");

class Animation {
	name: string; // Used by Animation Loader
	
	/**
	* The individual frames making up the Animation.
	* @member {Array}
	* @private
	*/
    frames: any[] = [];
	/**
	* The currently displayed frame of the Animation.
	* @member {number}
	*/
	frame = 0;
	/**
	* How long, in milliseconds, the current frame has been displayed for.
	* @member {number}
	* @private
	*/
	elapsedMillis = 0;
	/**
	 * The frame at which to restart the Animation after the last frame plays. It defaults to 0, so animations loop. If you want to disable looping, set this to the last frame. Otherwise, you can set it to one of the middle frames to have non-repeating introductory frames, while having looping later frames.
	 * @member {number}
	 */
	repeatAt = 0;
	/**
	 * The width of the first frame of the Animation.
	 * @member {number}
	 * @readonly
	 */
	width = 0;
	/**
	 * The height of the first frame of the Animation.
	 * @member {number}
	 * @readonly
	 */
	height = 0;
	
	/**
	 * An animated picture made of multiple images. Animations are constructed for you by {@link AnimationLoader}.
	 * @constructor
	 */
	constructor() {
	}
	
	/**
	 * Make a copy of this Animation.
	 * @returns {Animation}
	 */
	copy() {
		var anim = new Animation();
		anim.frames = this.frames;
		anim.frame = this.frame;
		anim.elapsedMillis = this.elapsedMillis;
		anim.repeatAt = this.repeatAt;
		anim.width = this.width;
		anim.height = this.height;
		return anim;
	}
	
	/**
	 * Add a frame to the Animation.
	 * @param {external:canvas|external:image} img The image to draw for the frame being added.
	 * @param {number} time How long, in milliseconds, this frame should be displayed in the Animation.
	 */
	add(img: any, time: number) {
		this.frames.push({
			img: img,
			time: time
		});
		if (this.frames.length === 1) {
			this.width = img.width;
			this.height = img.height;
		}
	}
	
	/**
	 * Advance the Animation by a single frame.
	 */
	step() {
		this.frame++;
		if (this.frame >= this.frames.length) {
			this.frame = this.repeatAt;
		}
	}
	
	/**
	 * Advance the Animation by a number of milliseconds.
	 * @param {number} elapsedMillis How many milliseconds to advance the animation by.
	 */
	move(elapsedMillis: number) {
		this.elapsedMillis += elapsedMillis;
		while (this.elapsedMillis > this.frames[this.frame].time) {
			this.elapsedMillis -= this.frames[this.frame].time;
			this.step();
		}
	}
	
	/**
	 * Draw the current frame of the Animation.
	 * @param {external:CanvasRenderingContext2D} context The drawing context.
	 * @param {number} x The x coordinate to draw the animation at.
	 * @param {number} y The y coordinate to draw the animation at.
	 */
	draw(context: CanvasRenderingContext2D, x: number, y: number) {
		var img = this.frames[this.frame].img;
		context.drawImage(img, x, y);
	}
	
	/**
	 * Reset the Animation to the first frame. This can be useful when you have one piece of code calling {@link Animation#move} each frame, but you want the animation to appear stopped.
	 */
	reset() {
		this.frame = 0;
		this.elapsedMillis = 0;
	}
	
	/**
	 * Flip all frames in the Animation horizontally. Useful when you want to use a single set of images for left and right animations.
	 * @return {Animation} The Animation, so you can chain calls to rotate/flip methods.
	 */
	flipHorizontally() {
		for (var i = 0; i < this.frames.length; i++) {
			this.frames[i].img = buffer.flipBufferHorizontally(this.frames[i].img);
		}
		return this;
	}
	
	/**
	 * Flip all frames in the Animation vertically. Useful when you want to use a single set of images for up and down animations.
	 * @return {Animation} The Animation, so you can chain calls to rotate/flip methods.
	 */
	flipVertically() {
		for (var i = 0; i < this.frames.length; i++) {
			this.frames[i].img = buffer.flipBufferVertically(this.frames[i].img);
		}
		return this;
	}
	
	/**
	 * Rotate all frames in the Animation clockwise by 90 degrees.
	 * @return {Animation} The Animation, so you can chain calls to rotate/flip methods.
	 */
	rotateClockwise() {
		var w = this.width;
		this.width = this.height;
		this.height = w;
		for (var i = 0; i < this.frames.length; i++) {
			this.frames[i].img = buffer.rotateClockwise(this.frames[i].img);
		}
		return this;
	}
	
	/**
	 * Rotate all frames in the Animation counter-clockwise by 90 degrees.
	 * @return {Animation} The Animation, so you can chain calls to rotate/flip methods.
	 */
	rotateCounterclockwise() {
		var w = this.width;
		this.width = this.height;
		this.height = w;
		for (var i = 0; i < this.frames.length; i++) {
			this.frames[i].img = buffer.rotateCounterclockwise(this.frames[i].img);
		}
		return this;
	}
}

export = Animation;
