"use strict";

/**
 * Holds the current orientation of the device if the device has an accelerometer.
 * @constructor
 */
function Accelerometer() {
	/**
	 * The angle of the device rotated around the z-axis. The z-axis is the axis coming out of the device screen. alpha represents how much the devies is spun around the center of the screen.
	 * @member {number}
	 */
	this.alpha = 0;
	/**
	 * The angle of the device rotated around the x-axis. The x-axis is horizontal across the device screen. beta represents how much the device is tilted forward or backward.
	 * @member {number}
	 */
	this.beta = 0;
	/**
	 * The angle of the device rotated around the y-axis. The y-axis is vertical across the device screen. gamma represents how much the device is turned left or right.
	 * @member {number}
	 */
	this.gamma = 0;

	var self = this;
	window.addEventListener("deviceorientation", function(event) {
		self.alpha = event.alpha;
		self.beta = event.beta;
		self.gamma = event.gamma;
	}, false);
}

module.exports = Accelerometer;
