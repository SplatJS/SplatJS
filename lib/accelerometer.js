"use strict";

function Accelerometer(canvas) {
	this.alpha = 0;
	this.beta = 0;
	this.gamma = 0;

	var that = this;
	window.addEventListener('deviceorientation', function(event) {
	    that.alpha = event.alpha;
	    that.beta = event.beta;
	    that.gamma = event.gamma;
	}, false);
}

module.exports = Accelerometer;