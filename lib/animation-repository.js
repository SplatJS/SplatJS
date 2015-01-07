"use strict";

function AnimationRepository() {
	this.animations = {};
}
AnimationRepository.prototype.add = function(name) {
	this.animations[name] = [];
};
AnimationRepository.prototype.addFrame = function(name, time, properties) {
	this.animations[name].push({
		time: time,
		properties: properties
	});
};
AnimationRepository.prototype.addFilmStrip = function(name, frameCount, frameTime, frameWidth) {
	this.add(name);
	for (var i = 0; i < frameCount; i++) {
		this.addFrame(name, frameTime, { image: { sourceX: i * frameWidth } });
	}
};
AnimationRepository.prototype.get = function(name) {
	return this.animations[name];
};

module.exports = AnimationRepository;
