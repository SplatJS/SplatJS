"use strict";

var Camera = require("./camera");

/**
 * A {@link Splat.Camera} that tracks an {@link Splat.Entity} to keep it on screen within an invisible box. If the Entity moves outside of the invisible box, the camera is adjusted the minimal amount so that the Entity is back inside the box.
 * @constructor
 * @augments Splat.Entity
 * @alias Splat.EntityBoxCamera
 * @param {Splat.Entity} entity The Entity for the camera to track.
 * @param {number} width The width of the invisible box to keep the {@link Splat.Entity} within.
 * @param {number} height The height of the invisible box to keep the {@link Splat.Entity} within.
 * @param {number} screenCenterX The center of the invisible box on the screen along the x axis.
 * @param {number} screenCenterY The center of the invisible box on the screen along the y axis.
 * @example
var scene = new Splat.Scene(canvas, function() {
	// initialization
	this.player = new Splat.Entity(200, 200, 50, 50);
	// make a camera that won't let the player closer than 100 pixels to the left and right sides, or 50 pixels from the top or bottom
	this.camera = new Splat.EntityBoxCamera(this.player, canvas.width - 200, canvas.height - 100, canvas.width / 2, canvas.height / 2);
}, function(elapsedMillis) {
	// simulation
}, function(context) {
	// draw
});
 */
function EntityBoxCamera(entity, width, height, screenCenterX, screenCenterY) {
	/**
	 * The {@link Splat.Entity} for the camera to track.
	 * @member {Splat.Entity}
	 */
	this.entity = entity;
	/**
	 */
	/**
	 * The center of the invisible box on the screen along the x axis.
	 * @member {number}
	 */
	this.screenCenterX = screenCenterX;
	/**
	 * The center of the invisible box on the screen along the y axis.
	 * @member {number}
	 */
	this.screenCenterY = screenCenterY;

	var x = keepPositionInBox(entity.x, entity.width, 0, width, screenCenterX);
	var y = keepPositionInBox(entity.y, entity.height, 0, height, screenCenterY);
	Camera.call(this, x, y, width, height);
}
EntityBoxCamera.prototype = Object.create(Camera.prototype);
/**
 * Adjust the camera so that it keeps {@link Splat.EntityBoxCamera#entity} within the invisible box. This is usually automatically called by the {@link Splat.Scene} for you.
 */
EntityBoxCamera.prototype.move = function() {
	this.x = keepPositionInBox(this.entity.x, this.entity.width, this.x, this.width, this.screenCenterX);
	this.y = keepPositionInBox(this.entity.y, this.entity.height, this.y, this.height, this.screenCenterY);
};

function keepPositionInBox(entityPos, entitySize, thisPos, thisSize, offset) {
	var boundsFromCenter = thisSize / 2;
	if (entityPos < thisPos + offset - boundsFromCenter) {
		thisPos = entityPos - offset + boundsFromCenter;
	}
	if (entityPos + entitySize > thisPos + offset + boundsFromCenter) {
		thisPos = entityPos + entitySize - offset - boundsFromCenter;
	}
	return thisPos;
}

module.exports = EntityBoxCamera;
