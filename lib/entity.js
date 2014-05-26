"use strict";

/**
 * The base in-game object, it supports a location and velocity.
 * Entities are boxes, consisting of an x,y coordinate along with a width and height.
 * Entities have basic collision detection and resolution.
 * @constructor
 * @alias Splat.Entity
 * @param {number} x The top-left x coordinate
 * @param {number} y The top-left y coordinate
 * @param {number} width The width on the x-axis
 * @param {number} height The height on the y-axis
 */
function Entity(x, y, width, height) {
	/**
	 * Leftmost position along the x-axis.
	 * @member {number}
	 */
	this.x = x;
	/**
	 * Topmost position along the y-axis.
	 * @member {number}
	 */
	this.y = y;
	/**
	 * Width of the Entity, extending to the right of {@link Splat.Entity#x}.
	 * @member {number}
	 */
	this.width = width;
	/**
	 * Height of the Entity, extending downward from {@link Splat.Entity#y}.
	 * @member {number}
	 */
	this.height = height;
	/**
	 * Velocity along the x-axis in pixels/millisecond.
	 * @member {number}
	 */
	this.vx = 0;
	/**
	 * Velocity along the y-axis in pixels/millisecond.
	 * @member {number}
	 */
	this.vy = 0;
	/**
	 * The value of {@link Splat.Entity#x} in the previous frame.
	 * @member {number}
	 * @readonly
	 */
	this.lastX = x;
	/**
	 * The value of {@link Splat.Entity#y} in the previous frame.
	 * @member {number}
	 * @readonly
	 */
	this.lastY = y;
	/**
	 * A multiplier on {@link Splat.Entity#vx}. Can be used to implement basic friction.
	 * @member {number}
	 * @private
	 */
	this.frictionX = 1;
	/**
	 * A multiplier on {@link Splat.Entity#vy}. Can be used to implement basic friction.
	 * @member {number}
	 * @private
	 */
	this.frictionY = 1;
}
/**
 * Simulate movement since the previous frame, changing {@link Splat.Entity#x} and {@link Splat.Entity#y} as necessary.
 * @param {number} elapsedMillis The number of milliseconds since the previous frame.
 */
Entity.prototype.move = function(elapsedMillis) {
	this.lastX = this.x;
	this.lastY = this.y;
	this.x += elapsedMillis * this.vx;
	this.y += elapsedMillis * this.vy;
	this.vx *= this.frictionX;
	this.vy *= this.frictionY;
};
/**
 * Test if this Entity horizontally overlaps another.
 * @param {Splat.Entity} other The Entity to test for overlap with
 * @returns {boolean}
 */
Entity.prototype.overlapsHoriz = function(other) {
	return this.x + this.width >= other.x && this.x <= other.x + other.width;
};
/**
 * Test if this Entity vertically overlaps another.
 * @param {Splat.Entity} other The Entity to test for overlap with
 * @returns {boolean}
 */
Entity.prototype.overlapsVert = function(other) {
	return this.y + this.height >= other.y && this.y <= other.y + other.height;
};
/**
 * Test if this Entity is currently colliding with another.
 * @param {Splat.Entity} other The Entity to test for collision with
 * @returns {boolean}
 */
Entity.prototype.collides = function(other) {
	return this.overlapsHoriz(other) && this.overlapsVert(other);
};

/**
 * Test if this Entity horizontally overlapped another in the previous frame.
 * @param {Splat.Entity} other The Entity to test for overlap with
 * @returns {boolean}
 */
Entity.prototype.didOverlapHoriz = function(other) {
	return this.lastX + this.width >= other.lastX && this.lastX <= other.lastX + other.width;
};
/**
 * Test if this Entity vertically overlapped another in the previous frame.
 * @param {Splat.Entity} other The Entity to test for overlap with
 * @returns {boolean}
 */
Entity.prototype.didOverlapVert = function(other) {
	return this.lastY + this.height >= other.lastY && this.lastY <= other.lastY + other.height;
};

/**
 * Test if this Entity was above another in the previous frame.
 * @param {Splat.Entity} other The Entity to test for above-ness with
 * @returns {boolean}
 */
Entity.prototype.wasAbove = function(other) {
	return this.lastY + this.height <= other.lastY;
};
/**
 * Test if this Entity was below another in the previous frame.
 * @param {Splat.Entity} other The Entity to test for below-ness with
 * @returns {boolean}
 */
Entity.prototype.wasBelow = function(other) {
	return this.lastY >= other.lastY + other.height;
};
/**
 * Test if this Entity was to the left of another in the previous frame.
 * @param {Splat.Entity} other The Entity to test for left-ness with
 * @returns {boolean}
 */
Entity.prototype.wasLeft = function(other) {
	return this.lastX + this.width <= other.lastX;
};
/**
 * Test if this Entity was to the right of another in the previous frame.
 * @param {Splat.Entity} other The Entity to test for right-ness with
 * @returns {boolean}
 */
Entity.prototype.wasRight = function(other) {
	return this.lastX >= other.lastX + other.width;
};

/**
 * Test if this Entity has changed position since the previous frame.
 * @returns {boolean}
 */
Entity.prototype.moved = function() {
	var x = this.x|0;
	var lastX = this.lastX|0;
	var y = this.y|0;
	var lastY = this.lastY|0;
	return (x !== lastX) || (y !== lastY);
};

Entity.prototype.draw = function() {
	// draw bounding boxes
	// context.strokeStyle = "#ff0000";
	// context.strokeRect(this.x, this.y, this.width, this.height);
};

/**
 * Adjust the Entity's position so its bottom edge does not penetrate the other Entity's top edge.
 * {@link Splat.Entity#vy} is also zeroed.
 * @param {Splat.Entity} other
 */
Entity.prototype.resolveBottomCollisionWith = function(other) {
	if (this.didOverlapHoriz(other) && this.wasAbove(other)) {
		this.y = other.y - this.height;
		this.vy = 0;
	}
};
/**
 * Adjust the Entity's position so its top edge does not penetrate the other Entity's bottom edge.
 * {@link Splat.Entity#vy} is also zeroed.
 * @param {Splat.Entity} other
 */
Entity.prototype.resolveTopCollisionWith = function(other) {
	if (this.didOverlapHoriz(other) && this.wasBelow(other)) {
		this.y = other.y + other.height;
		this.vy = 0;
	}
};
/**
 * Adjust the Entity's position so its right edge does not penetrate the other Entity's left edge.
 * {@link Splat.Entity#vx} is also zeroed.
 * @param {Splat.Entity} other
 */
Entity.prototype.resolveRightCollisionWith = function(other) {
	if (this.didOverlapVert(other) && this.wasLeft(other)) {
		this.x = other.x - this.width;
		this.vx = 0;
	}
};
/**
 * Adjust the Entity's position so its left edge does not penetrate the other Entity's right edge.
 * {@link Splat.Entity#vx} is also zeroed.
 * @param {Splat.Entity} other
 */
Entity.prototype.resolveLeftCollisionWith = function(other) {
	if (this.didOverlapVert(other) && this.wasRight(other)) {
		this.x = other.x + other.width;
		this.vx = 0;
	}
};
/**
 * Adjust the Entity's position so it does not penetrate the other Entity.
 * {@link Splat.Entity#vx} will be zeroed if {@link Splat.Entity#x} was adjusted, and {@link Splat.Entity#vy} will be zeroed if {@link Splat.Entity#y} was adjusted.
 * @param {Splat.Entity} other
 */
Entity.prototype.resolveCollisionWith = function(other) {
	this.resolveBottomCollisionWith(other);
	this.resolveTopCollisionWith(other);
	this.resolveRightCollisionWith(other);
	this.resolveLeftCollisionWith(other);
};

module.exports = Entity;
