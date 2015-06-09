"use strict";

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	enabled: boolean;
	age: number;
}

class Particles {
	setupParticle: (particle: Particle, config?: any) => void;
	drawParticle: (ctx: CanvasRenderingContext2D, particle: Particle) => void;
	particles: Particle[] = [];
	gravity = 0.1;
	maxAge = 1000;
	
	constructor(max: number, setupParticle: (particle: Particle, config?: any) => void, drawParticle: (ctx: CanvasRenderingContext2D, particle: Particle) => void) {
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
	}
	
	move(elapsedMillis: number) {
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
	}
	
	draw(context: CanvasRenderingContext2D) {
		for (var i = 0; i < this.particles.length; i++) {
			var particle = this.particles[i];
			if (!particle.enabled) {
				continue;
			}
			this.drawParticle(context, particle);
		}
	}
	
	add(quantity: number, x: number, y: number, velocity: number, config: any) {
		var setupParticle = (particle: Particle) => {
			particle.enabled = true;
			particle.age = 0;
			particle.x = x;
			particle.y = y;
			particle.vx = (Math.random() - 0.5) * velocity;
			particle.vy = (Math.random() - 0.5) * velocity;
			this.setupParticle(particle, config);
		}
	
		var particle: Particle;
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
		this.particles.sort((a, b) => b.age - a.age);
	
		for (i = 0; i < quantity; i++) {
			particle = this.particles[i];
			setupParticle(particle);
		}
	}
	
	reset() {
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].enabled = false;
		}
	}
}

export = Particles;
