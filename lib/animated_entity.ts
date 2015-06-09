"use strict";

import Entity = require("./entity");

class AnimatedEntity extends Entity {
	/**
	* The Animation or image to draw
	* @member {Animation|external:image}
	*/
    sprite: any;
	/**
	* How much to offset {@link Splat.AnimatedEntity#sprite} from {@link Splat.Entity#x} when drawing.
	* @member {number}
	*/
	spriteOffsetX: number;
	/**
	* How much to offset {@link Splat.AnimatedEntity#sprite} from {@link Splat.Entity#y} when drawing.
	* @member {number}
	*/
	spriteOffsetY: number;
	
	/**
	 * An upgraded {@link Splat.Entity} that knows how to draw and advance an {@link Animation}.
	 * @constructor
	 * @augments Splat.Entity
	 * @alias Splat.AnimatedEntity
	 * @param {number} x The top-left x coordinate. See {@link Splat.Entity#x}
	 * @param {number} y The top-left y coordinate. See {@link Splat.Entity#y}
	 * @param {number} width The width on the x-axis. See {@link Splat.Entity#width}
	 * @param {number} height The height on the y-axis. See {@link Splat.Entity#height}
	 * @param {Animation|external:image} sprite The Animation or image to draw
	 * @param {number} spriteOffsetX How much to offset {@link Splat.AnimatedEntity#sprite} from the {@link Splat.Entity#x} when drawing
	 * @param {number} spriteOffsetY How much to offset {@link Splat.AnimatedEntity#sprite} from the {@link Splat.Entity#y} when drawing
	 */
	constructor(x: number, y: number, width: number, height: number, sprite: any, spriteOffsetX: number, spriteOffsetY: number) {
		super(x, y, width, height);
		this.sprite = sprite;
		this.spriteOffsetX = spriteOffsetX;
		this.spriteOffsetY = spriteOffsetY;
	}

	/**
	 * Simulate movement since the last frame, changing {@link Splat.Entity#x}, {@link Splat.Entity#y}, and calling {@link Animation#move} if applicable.
	 * @param {number} elapsedMillis The number of milliseconds since the last frame.
	 */
	move(elapsedMillis: number) {
		super.move(elapsedMillis);
		if (typeof this.sprite.move === "function") {
			this.sprite.move(elapsedMillis);
		}
	}
	
	/**
	 * Draw the {@link Splat.AnimatedEntity#sprite}.
	 * @param {external:CanvasRenderingContext2D} context The drawing context.
	 */
	draw(context: CanvasRenderingContext2D) {
		if (typeof this.sprite.draw === "function") {
			this.sprite.draw(context, this.x + this.spriteOffsetX, this.y + this.spriteOffsetY);
		} else {
			context.drawImage(this.sprite, this.x + this.spriteOffsetX, this.y + this.spriteOffsetY);
		}
		// draw bounding boxes
		// context.strokeStyle = "#ff0000";
		// context.strokeRect(this.x, this.y, this.width, this.height);
	}
	
	/**
	 * Make a copy of this AnimatedEntity. The {@link Splat.AnimatedEntity#sprite} is not copied, so both entities will share it.
	 * @returns {Splat.AnimatedEntity}
	 */
	copy() {
		return new AnimatedEntity(this.x, this.y, this.width, this.height, this.sprite, this.spriteOffsetX, this.spriteOffsetY);
	}
}

export = AnimatedEntity;
