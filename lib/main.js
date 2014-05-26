"use strict";

var buffer = require("./buffer");

/**
 * @namespace Splat
 */
module.exports = {
	makeBuffer: buffer.makeBuffer,
	flipBufferHorizontally: buffer.flipBufferHorizontally,
	flipBufferVertically: buffer.flipBufferVertically,

	AnimatedEntity: require("./animated_entity"),
	AStar: require("./astar"),
	BinaryHeap: require("./binary_heap"),
	Camera: require("./camera"),
	saveData: require("./save_data"),
	Entity: require("./entity"),
	EntityBoxCamera: require("./entity_box_camera"),
	Game: require("./game"),
	math: require("./math"),
	NinePatch: require("./ninepatch"),
	Scene: require("./scene"),
	Timer: require("./timer"),
};
