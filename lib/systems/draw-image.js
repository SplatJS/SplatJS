"use strict";

module.exports = function(ecs, imageLoader) {
	ecs.addEach(function(entity, context) {
		var image = imageLoader.get(entity.image.name);
		if (!image) {
			return;
		}
		context.drawImage(
			image,
			entity.image.sourceX,
			entity.image.sourceY,
			entity.image.sourceWidth,
			entity.image.sourceHeight,
			entity.image.destinationX + entity.position.x,
			entity.image.destinationY + entity.position.y,
			entity.image.destinationWidth,
			entity.image.destinationHeight
		);
	}, ["image", "position"]);
};
