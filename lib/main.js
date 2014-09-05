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
	AnimatedEntity: require("./animated_entity"),
	AStar: require("./astar"),
	BinaryHeap: require("./binary_heap"),
	Button: require("./button"),
	Camera: require("./camera"),
	Entity: require("./entity"),
	EntityBoxCamera: require("./entity_box_camera"),
	Game: require("./game"),
	iap: require("./iap"),
	leaderboards: require("./leaderboards"),
	math: require("./math"),
	openUrl: require("./openUrl"),
	NinePatch: require("./ninepatch"),
	saveData: require("./save_data"),
	Scene: require("./scene"),
	Timer: require("./timer"),
};
