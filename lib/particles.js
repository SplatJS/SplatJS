"use strict";

function Particles(max, setupParticle, drawParticle) {
	this.particles = [];
	this.setupParticle = setupParticle;
	this.drawParticle = drawParticle;
	for (var i = 0; i < max; i++) {
		var particle = {
			x: 0,
			y: 0,
			vx: 0,
			vy: 0,
			enabled: false,
			age: 0
		};
		this.setupParticle(particle);
		this.particles.push(particle);
	}
	this.gravity = 0.1;
	this.maxAge = 1000;
}
Particles.prototype.move = function(elapsedMillis) {
	for (var i = 0; i < this.particles.length; i++) {
		var particle = this.particles[i];
		if (!particle.enabled) {
			continue;
		}
		particle.age += elapsedMillis;
		if (particle.age > this.maxAge) {
			particle.enabled = false;
			continue;
		}
		particle.x += particle.vx * elapsedMillis;
		particle.y += particle.vy * elapsedMillis;
		particle.vy += this.gravity;
	}
};
Particles.prototype.draw = function(context) {
	for (var i = 0; i < this.particles.length; i++) {
		var particle = this.particles[i];
		if (!particle.enabled) {
			continue;
		}
		this.drawParticle(context, particle);
	}
};
Particles.prototype.add = function(quantity, x, y, velocity, config) {
	var self = this;
	function setupParticle(particle) {
		particle.enabled = true;
		particle.age = 0;
		particle.x = x;
		particle.y = y;
		particle.vx = (Math.random() - 0.5) * velocity;
		particle.vy = (Math.random() - 0.5) * velocity;
		self.setupParticle(particle, config);
	}

	var particle;
	for (var i = 0; i < this.particles.length; i++) {
		particle = this.particles[i];
		if (particle.enabled) {
			continue;
		}
		if (quantity < 1) {
			return;
		}
		quantity--;
		setupParticle(particle);
	}

	// sort oldest first
	this.particles.sort(function(a, b) {
		return b.age - a.age;
	});

	for (i = 0; i < quantity; i++) {
		particle = this.particles[i];
		setupParticle(particle);
	}
};
Particles.prototype.reset = function() {
	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].enabled = false;
	}
};

module.exports = Particles;
