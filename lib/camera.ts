"use strict";

import Entity = require("./entity");

class Camera extends Entity {
	/**
	 * A basic camera. It's really an {@link Splat.Entity}, so you can control it in the same way.
	 * By changing {@link Splat.Entity#x} and {@link Splat.Entity#y} you control what portion of the canvas is viewable.
	 * For example, if the Camera is at 50,50, and you draw a rectangle at 200,200,
	 * it will appear on the screen at 150,150.
	 * @constructor
	 * @augments Splat.Entity
	 * @alias Splat.Camera
	 * @param {number} x The top-left x coordinate
	 * @param {number} y The top-left y coordinate
	 * @param {number} width The width on the x-axis. Currently doesn't do anything.
	 * @param {number} height The height on the y-axis. Currently doesn't do anything.
	 */
	constructor(x: number, y: number, width: number, height: number) {
		super(x, y, width, height);
	}
	
	/**
	 * Offset all following draw operations on the canvas.
	 * This is automatically called for you by {@link Splat.Scene}.
	 * @param {external:CanvasRendingContext2D} context The context to offset
	 */
	draw(context: CanvasRenderingContext2D) {
		context.translate(-(this.x|0), -(this.y|0));
	}
	
	/**
	 * Draw on the canvas at not-offset coordinates.
	 * For example, if the camera is at 50,50 and you draw a rectangle at 200,200
	 * it will appear on the screen at 200,200.
	 * @param {external:CanvasRendingContext2D} context The context to offset
	 * @param {drawCallback} drawFunc The callback the performs the non-offset drawing.
	 */
	drawAbsolute(context: CanvasRenderingContext2D, drawFunc: (ctx: CanvasRenderingContext2D) => void) {
		context.save();
		context.translate(this.x|0, this.y|0);
		drawFunc(context);
		context.restore();
	}
}

export = Camera;
