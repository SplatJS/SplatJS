"use strict";

function Accelerometer() {
	this.alpha = 0;
	this.beta = 0;
	this.gamma = 0;

	var self = this;
	window.addEventListener("deviceorientation", function(event) {
		self.alpha = event.alpha;
		self.beta = event.beta;
		self.gamma = event.gamma;
	}, false);
}

module.exports = Accelerometer;
