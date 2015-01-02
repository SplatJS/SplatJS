"use strict";

module.exports = function image(name, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight) {
	return {
		name: name,
		sourceX: sourceX,
		sourceY: sourceY,
		sourceWidth: sourceWidth,
		sourceHeight: sourceHeight,
		destinationX: destinationX,
		destinationY: destinationY,
		destinationWidth: destinationWidth,
		destinationHeight: destinationHeight
	};
};
