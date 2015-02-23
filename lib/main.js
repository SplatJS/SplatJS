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
	SoundLoader: require("./sound_loader"),

	components: {
		animation: require("./components/animation"),
		camera: require("./components/camera"),
		friction: require("./components/friction"),
		image: require("./components/image"),
		movement2d: require("./components/movement-2d"),
		playableArea: require("./components/playable-area"),
		playerController2d: require("./components/player-controller-2d"),
		position: require("./components/position"),
		size: require("./components/size"),
		timers: require("./components/timers"),
		velocity: require("./components/velocity"),
	},
	systems: require("./systems")
};
