"use strict";

module.exports = {
	advanceAnimations: require("./systems/advance-animations"),
	advanceTimers: require("./systems/advance-timers"),
	applyFriction: require("./systems/apply-friction"),
	applyMovement2d: require("./systems/apply-movement-2d"),
	applyVelocity: require("./systems/apply-velocity"),
	boxCollider: require("./systems/box-collider"),
	centerPosition: require("./systems/center-position"),
	clearScreen: require("./systems/clear-screen"),
	constrainToPlayableArea: require("./systems/constrain-to-playable-area"),
	controlPlayer: require("./systems/control-player"),
	drawFrameRate: require("./systems/draw-frame-rate"),
	drawImage: require("./systems/draw-image"),
	drawRectangles: require("./systems/draw-rectangles"),
	followParent: require("./systems/follow-parent"),
	viewport: require("./systems/viewport"),
};
