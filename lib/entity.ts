"use strict";

class Entity {
	/**
	* Leftmost position along the x-axis.
	* @member {number}
	*/
	x: number;
	/**
	* Topmost position along the y-axis.
	* @member {number}
	*/
	y: number;
	/**
	* Width of the Entity, extending to the right of {@link Splat.Entity#x}.
	* @member {number}
	*/
	width: number;
	/**
	* Height of the Entity, extending downward from {@link Splat.Entity#y}.
	* @member {number}
	*/
	height: number;
	/**
	* Velocity along the x-axis in pixels/millisecond.
	* @member {number}
	*/
	vx: number;
	/**
	* Velocity along the y-axis in pixels/millisecond.
	* @member {number}
	*/
	vy: number;
	/**
	* The value of {@link Splat.Entity#x} in the previous frame.
	* @member {number}
	* @readonly
	*/
	lastX: number;
	/**
	* The value of {@link Splat.Entity#y} in the previous frame.
	* @member {number}
	* @readonly
	*/
	lastY: number;
	/**
	* A multiplier on {@link Splat.Entity#vx}. Can be used to implement basic friction.
	* @member {number}
	* @private
	*/
	frictionX: number;
	/**
	* A multiplier on {@link Splat.Entity#vy}. Can be used to implement basic friction.
	* @member {number}
	* @private
	*/
	frictionY: number;
	
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
	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.vx = 0;
		this.vy = 0;
		this.lastX = x;
		this.lastY = y;
		this.frictionX = 1;
		this.frictionY = 1;
	}
	
	/**
	 * Simulate movement since the previous frame, changing {@link Splat.Entity#x} and {@link Splat.Entity#y} as necessary.
	 * @param {number} elapsedMillis The number of milliseconds since the previous frame.
	 */
	move(elapsedMillis: number) {
		this.lastX = this.x;
		this.lastY = this.y;
		this.x += elapsedMillis * this.vx;
		this.y += elapsedMillis * this.vy;
		this.vx *= this.frictionX;
		this.vy *= this.frictionY;
	}
	
	/**
	 * Test if this Entity horizontally overlaps another.
	 * @param {Splat.Entity} other The Entity to test for overlap with
	 * @returns {boolean}
	 */
	overlapsHoriz(other: Entity) {
		return this.x + this.width > other.x && this.x < other.x + other.width;
	}
	
	/**
	 * Test if this Entity vertically overlaps another.
	 * @param {Splat.Entity} other The Entity to test for overlap with
	 * @returns {boolean}
	 */
	overlapsVert(other: Entity) {
		return this.y + this.height > other.y && this.y < other.y + other.height;
	}
	
	/**
	 * Test if this Entity is currently colliding with another.
	 * @param {Splat.Entity} other The Entity to test for collision with
	 * @returns {boolean}
	 */
	collides(other: Entity) {
		return this.overlapsHoriz(other) && this.overlapsVert(other);
	}

	/**
	 * Test if this Entity horizontally overlapped another in the previous frame.
	 * @param {Splat.Entity} other The Entity to test for overlap with
	 * @returns {boolean}
	 */
	didOverlapHoriz(other: Entity) {
		return this.lastX + this.width > other.lastX && this.lastX < other.lastX + other.width;
	}
	
	/**
	 * Test if this Entity vertically overlapped another in the previous frame.
	 * @param {Splat.Entity} other The Entity to test for overlap with
	 * @returns {boolean}
	 */
	didOverlapVert(other: Entity) {
		return this.lastY + this.height > other.lastY && this.lastY < other.lastY + other.height;
	}

	/**
	 * Test if this Entity was above another in the previous frame.
	 * @param {Splat.Entity} other The Entity to test for above-ness with
	 * @returns {boolean}
	 */
	wasAbove(other: Entity) {
		return this.lastY + this.height <= other.lastY;
	}
	
	/**
	 * Test if this Entity was below another in the previous frame.
	 * @param {Splat.Entity} other The Entity to test for below-ness with
	 * @returns {boolean}
	 */
	wasBelow(other: Entity) {
		return this.lastY >= other.lastY + other.height;
	}
	
	/**
	 * Test if this Entity was to the left of another in the previous frame.
	 * @param {Splat.Entity} other The Entity to test for left-ness with
	 * @returns {boolean}
	 */
	wasLeft(other: Entity) {
		return this.lastX + this.width <= other.lastX;
	}
	
	/**
	 * Test if this Entity was to the right of another in the previous frame.
	 * @param {Splat.Entity} other The Entity to test for right-ness with
	 * @returns {boolean}
	 */
	wasRight(other: Entity) {
		return this.lastX >= other.lastX + other.width;
	}
	
	/**
	 * Test if this Entity has changed position since the previous frame.
	 * @returns {boolean}
	 */
	moved() {
		var x = this.x|0;
		var lastX = this.lastX|0;
		var y = this.y|0;
		var lastY = this.lastY|0;
		return (x !== lastX) || (y !== lastY);
	}
	
	draw(context: any) {
		// draw bounding boxes
		// context.strokeStyle = "#ff0000";
		// context.strokeRect(this.x, this.y, this.width, this.height);
	}
	
	/**
	 * Adjust the Entity's position so its bottom edge does not penetrate the other Entity's top edge.
	 * {@link Splat.Entity#vy} is also zeroed.
	 * @param {Splat.Entity} other
	 */
	resolveBottomCollisionWith(other: Entity) {
		if (this.overlapsHoriz(other) && this.wasAbove(other)) {
			this.y = other.y - this.height;
			this.vy = 0;
		}
	}
	
	/**
	 * Adjust the Entity's position so its top edge does not penetrate the other Entity's bottom edge.
	 * {@link Splat.Entity#vy} is also zeroed.
	 * @param {Splat.Entity} other
	 */
	resolveTopCollisionWith(other: Entity) {
		if (this.overlapsHoriz(other) && this.wasBelow(other)) {
			this.y = other.y + other.height;
			this.vy = 0;
		}
	}
	
	/**
	 * Adjust the Entity's position so its right edge does not penetrate the other Entity's left edge.
	 * {@link Splat.Entity#vx} is also zeroed.
	 * @param {Splat.Entity} other
	 */
	resolveRightCollisionWith(other: Entity) {
		if (this.overlapsVert(other) && this.wasLeft(other)) {
			this.x = other.x - this.width;
			this.vx = 0;
		}
	}
	
	/**
	 * Adjust the Entity's position so its left edge does not penetrate the other Entity's right edge.
	 * {@link Splat.Entity#vx} is also zeroed.
	 * @param {Splat.Entity} other
	 */
	resolveLeftCollisionWith(other: Entity) {
		if (this.overlapsVert(other) && this.wasRight(other)) {
			this.x = other.x + other.width;
			this.vx = 0;
		}
	}
	
	/**
	 * Adjust the Entity's position so it does not penetrate the other Entity.
	 * {@link Splat.Entity#vx} will be zeroed if {@link Splat.Entity#x} was adjusted, and {@link Splat.Entity#vy} will be zeroed if {@link Splat.Entity#y} was adjusted.
	 * @param {Splat.Entity} other
	 */
	resolveCollisionWith(other: Entity) {
		this.resolveBottomCollisionWith(other);
		this.resolveTopCollisionWith(other);
		this.resolveRightCollisionWith(other);
		this.resolveLeftCollisionWith(other);
	}
	
	/**
	 * Return a list of all Entities that collide with this Entity.
	 * @param {Array} entities A list of Entities to check for collisions.
	 * @return {Array} A list of entities that collide with this Entity.
	 */
	getCollisions(entities: Entity[]) {
		return entities.filter(entity => this.collides(entity));
	}
	
	/**
	 * Detect and resolve collisions between this Entity and a list of other Entities
	 * @param {Array} entities A list of Entities to solve against.
	 * @return {Array} A list of entities that were involved in collisions.
	 */
	solveCollisions(entities: Entity[]) {
		var involved = [];
	
		var countCollisionsAfterResolution = (block: Entity) => {
			var x = this.x;
			var y = this.y;
			var vx = this.vx;
			var vy = this.vy;
	
			this.resolveCollisionWith(block);
			var len = this.getCollisions(entities).length;
	
			this.x = x;
			this.y = y;
			this.vx = vx;
			this.vy = vy;
	
			return { block, len };
		};
	
		var minResolution = (previous: { block: Entity, len: number }, current: { block: Entity, len: number }) => {
			if (current.len < previous.len) {
				return current;
			}
			return previous;
		};
	
		while (true) {
			var collisions = this.getCollisions(entities);
			if (collisions.length === 0) {
				break;
			}
	
			var resolutions = collisions.map(countCollisionsAfterResolution);
			var minResolve = resolutions.reduce(minResolution);
			this.resolveCollisionWith(minResolve.block);
			involved.push(minResolve.block);
	
			if (minResolve[1] === collisions.length) {
				break;
			}
			if (minResolve[1] === 0) {
				break;
			}
		}
		return involved;
	}
}

export = Entity;
