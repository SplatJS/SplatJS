"use strict";

module.exports = function movement2d(accel, max) {
	return {
		up: false,
		down: false,
		left: false,
		right: false,
		upAccel: -accel,
		downAccel: accel,
		leftAccel: -accel,
		rightAccel: accel,
		upMax: -max,
		downMax: max,
		leftMax: -max,
		rightMax: max
	};
};
