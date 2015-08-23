"use strict";

function drawEntity(data, entity, context) {
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
}

module.exports = function(ecs, data) {
	ecs.add(function(entities, context) {
		var keys = Object.keys(entities);
		keys.sort(function(a, b) {
			var za = (entities[a].zindex || {zindex:0}).zindex;
			var zb = (entities[b].zindex || {zindex:0}).zindex;
			return za - zb;
		});

		for (var i = 0; i < keys.length; i++) {
			var entity = entities[keys[i]];
			if (entity.image === undefined || entity.position === undefined) {
				continue;
			}
			drawEntity(data, entity, context);
		}

	});
};
