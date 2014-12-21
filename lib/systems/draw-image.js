"use strict";

module.exports = function(ecs, imageLoader) {
	ecs.addEach(function(entity, context) {
		var image = imageLoader.get(entity.image.name);
		if (image) {
			context.drawImage(image, entity.position.x, entity.position.y);
		}
	}, ["image", "position"]);
};
