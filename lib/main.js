"use strict";

var buffer = require("./buffer");

/**
 * @namespace Splat
 */
module.exports = {
	makeBuffer: buffer.makeBuffer,
	flipBufferHorizontally: buffer.flipBufferHorizontally,
	flipBufferVertically: buffer.flipBufferVertically,

	ads: require("./ads"),
	AStar: require("./astar"),
	BinaryHeap: require("./binary_heap"),
	EntityPool: require("./entity-pool"),
	iap: require("./iap"),
	ImageLoader: require("./image_loader"),
	Input: require("./input"),
	leaderboards: require("./leaderboards"),
	loadingScene: require("./loading-scene"),
	math: require("./math"),
	openUrl: require("./openUrl"),
	NinePatch: require("./ninepatch"),
	Particles: require("./particles"),
	saveData: require("./save_data"),
	Scene: require("./scene"),

	components: {
		animation: require("./components/animation"),
		camera: require("./components/camera"),
		friction: require("./components/friction"),
		image: require("./components/image"),
		movement2d: require("./components/movement-2d"),
		playableArea: require("./components/playable-area"),
		position: require("./components/position"),
		size: require("./components/size"),
		velocity: require("./components/velocity"),
	},
	systems: {
		advanceAnimations: require("./systems/advance-animations"),
		applyFriction: require("./systems/apply-friction"),
		applyMovement2d: require("./systems/apply-movement-2d"),
		applyVelocity: require("./systems/apply-velocity"),
		boxCollider: require("./systems/box-collider"),
		clearScreen: require("./systems/clear-screen"),
		constrainToPlayableArea: require("./systems/constrain-to-playable-area"),
		drawFrameRate: require("./systems/draw-frame-rate"),
		drawImage: require("./systems/draw-image"),
		drawRectangles: require("./systems/draw-rectangles"),
		viewport: require("./systems/viewport"),
	}
};
