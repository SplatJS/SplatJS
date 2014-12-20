"use strict";

module.exports = function(ecs) {
	ecs.addEach(function(entity, context) {
		if (entity.strokeStyle) {
			context.strokeStyle = entity.strokeStyle;
		}
		context.strokeRect(Math.floor(entity.position.x), Math.floor(entity.position.y), entity.size.width, entity.size.height);
	}, ["position", "size"]);
};
