"use strict";

var Entity = require("./entity");

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
function AnimatedEntity(x, y, width, height, sprite, spriteOffsetX, spriteOffsetY) {
	/**
	 * The Animation or image to draw
	 * @member {Animation|external:image}
	 */
	this.sprite = sprite;
	/**
	 * How much to offset {@link Splat.AnimatedEntity#sprite} from {@link Splat.Entity#x} when drawing.
	 * @member {number}
	 */
	this.spriteOffsetX = spriteOffsetX;
	/**
	 * How much to offset {@link Splat.AnimatedEntity#sprite} from {@link Splat.Entity#y} when drawing.
	 * @member {number}
	 */
	this.spriteOffsetY = spriteOffsetY;
	Entity.call(this, x, y, width, height);
}
AnimatedEntity.prototype = Object.create(Entity.prototype);
/**
 * Simulate movement since the last frame, changing {@link Splat.Entity#x}, {@link Splat.Entity#y}, and calling {@link Animation#move} if applicable.
 * @param {number} elapsedMillis The number of milliseconds since the last frame.
 */
AnimatedEntity.prototype.move = function(elapsedMillis) {
	Entity.prototype.move.call(this, elapsedMillis);
	if (typeof this.sprite.move === "function") {
		this.sprite.move(elapsedMillis);
	}
};
/**
 * Draw the {@link Splat.AnimatedEntity#sprite}.
 * @param {external:CanvasRenderingContext2D} context The drawing context.
 */
AnimatedEntity.prototype.draw = function(context) {
	if (typeof this.sprite.draw === "function") {
		context.save(); 
		context.translate((this.x + (this.sprite.width/2)) + this.spriteOffsetX, (this.y + (this.sprite.height/2) )+ this.spriteOffsetY);
		context.rotate(this.angle * (Math.PI / 180));
		this.sprite.draw(context, -(this.sprite.width/2) + this.spriteOffsetX, -(this.sprite.height/2) + this.spriteOffsetY);
		context.restore(); 
	} else {
		context.save(); 
		context.translate(this.x + this.spriteOffsetX, this.y + this.spriteOffsetY);
		context.rotate(this.angle * (Math.PI / 180));
		context.drawImage(this.sprite, -(this.sprite.width/2) + this.spriteOffsetX, -(this.sprite.height/2) + this.spriteOffsetY);
		context.restore(); 
	}

	// draw bounding boxes
	// context.strokeStyle = "#ff0000";
	// context.strokeRect(this.x, this.y, this.width, this.height);
};
/**
 * Make a copy of this AnimatedEntity. The {@link Splat.AnimatedEntity#sprite} is not copied, so both entities will share it.
 * @returns {Splat.AnimatedEntity}
 */
AnimatedEntity.prototype.copy = function() {
	return new AnimatedEntity(this.x, this.y, this.width, this.height, this.sprite, this.spriteOffsetX, this.spriteOffsetY);
};

module.exports = AnimatedEntity;
