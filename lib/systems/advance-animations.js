"use strict";

function setOwnPropertiesDeep(src, dest) {
	var props = Object.keys(src);
	for (var i = 0; i < props.length; i++) {
		var prop = props[i];
		var val = src[prop];
		if (typeof val === "object") {
			if (!dest[prop]) {
				dest[prop] = {};
			}
			setOwnPropertiesDeep(val, dest[prop]);
		} else {
			dest[prop] = val;
		}
	}
}

module.exports = function advanceAnimations(ecs, animationRepository) {
	ecs.addEach(function(entity, elapsed) {
		var animation = animationRepository.get(entity.animation.name);

		entity.animation.time += elapsed * entity.animation.speed;
		while (entity.animation.time > animation[entity.animation.frame].time) {
			entity.animation.time -= animation[entity.animation.frame].time;
			entity.animation.frame++;
			if (entity.animation.frame >= animation.length) {
				if (entity.animation.loop) {
					entity.animation.frame = 0;
				} else {
					entity.animation.frame--;
				}
			}
		}
		setOwnPropertiesDeep(animation[entity.animation.frame].properties, entity);
	}, ["animation"]);
};
