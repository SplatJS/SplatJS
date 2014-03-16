"use strict";

function Entity(x, y, width, height) {
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
Entity.prototype.move = function(elapsedMillis) {
	this.lastX = this.x;
	this.lastY = this.y;
	this.x += elapsedMillis * this.vx;
	this.y += elapsedMillis * this.vy;
	this.vx *= this.frictionX;
	this.vy *= this.frictionY;
};
Entity.prototype.overlapsHoriz = function(other) {
	return this.x + this.width >= other.x && this.x <= other.x + other.width;
};
Entity.prototype.overlapsVert = function(other) {
	return this.y + this.height >= other.y && this.y <= other.y + other.height;
};
Entity.prototype.collides = function(other) {
	return this.overlapsHoriz(other) && this.overlapsVert(other);
};

Entity.prototype.didOverlapHoriz = function(other) {
	return this.lastX + this.width >= other.lastX && this.lastX <= other.lastX + other.width;
};
Entity.prototype.didOverlapVert = function(other) {
	return this.lastY + this.height >= other.lastY && this.lastY <= other.lastY + other.height;
};
Entity.prototype.wasAbove = function(other) {
	return this.lastY + this.height <= other.lastY;
};
Entity.prototype.wasBelow = function(other) {
	return this.lastY >= other.lastY + other.height;
};
Entity.prototype.wasLeft = function(other) {
	return this.lastX + this.width <= other.lastX;
};
Entity.prototype.wasRight = function(other) {
	return this.lastX >= other.lastX + other.width;
};
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
Entity.prototype.resolveBottomCollisionWith = function(other) {
	if (this.didOverlapHoriz(other) && this.wasAbove(other)) {
		this.y = other.y - this.height;
		this.vy = 0;
	}
};
Entity.prototype.resolveTopCollisionWith = function(other) {
	if (this.didOverlapHoriz(other) && this.wasBelow(other)) {
		this.y = other.y + other.height;
		this.vy = 0;
	}
};
Entity.prototype.resolveRightCollisionWith = function(other) {
	if (this.didOverlapVert(other) && this.wasLeft(other)) {
		this.x = other.x - this.width;
		this.vx = 0;
	}
};
Entity.prototype.resolveLeftCollisionWith = function(other) {
	if (this.didOverlapVert(other) && this.wasRight(other)) {
		this.x = other.x + other.width;
		this.vx = 0;
	}
};
Entity.prototype.resolveCollisionWith = function(other) {
	this.resolveBottomCollisionWith(other);
	this.resolveTopCollisionWith(other);
	this.resolveRightCollisionWith(other);
	this.resolveLeftCollisionWith(other);
};

module.exports = Entity;
