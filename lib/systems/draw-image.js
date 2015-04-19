"use strict";

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, context) {
		var image = data.images.get(entity.image.name);
		if (!image) {
			console.error("No such image", entity.image.name);
			return;
		}
		try {
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
		} catch (e) {
			console.error("Error drawing image", entity.image.name, e);
		}
	}, ["image", "position"]);
};
