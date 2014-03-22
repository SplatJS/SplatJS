"use strict";

/**
 * A timer that calls callbacks while it is running, and when it expires.
 * @constructor
 * @param {simulationCallback} onTick Called when the Timer is {@link Timer#tick tick()}ed
 * @param {number} expireMillis The number of milliseconds until the Timer expires
 * @param {emptyCallback} onExpire Called when the Timer expires
 */
function Timer(onTick, expireMillis, onExpire) {
	/**
	 * Called when the Timer is {@link Timer#tick tick()}ed
	 * @member {tickCallback}
	 * @private
	 */
	this.onTick = onTick;
	/**
	 * The number of milliseconds until the Timer expires.
	 * When {@link Timer#time} reaches this number, the Timer will be expired, and {@link Timer#onExpire} will be called.
	 * @member {number}
	 * @private
	 */
	this.expireMillis = expireMillis;
	/**
	 * Called when the Timer expires.
	 * @member {expireCallback}
	 * @private
	 */
	this.onExpire = onExpire;
	/**
	 * Whether or not the Timer is currently running.
	 * @member {boolean}
	 * @private
	 */
	this.running = false;
	/**
	 * How long the Timer has run in milliseconds.
	 * @member {number}
	 * @private
	 */
	this.time = 0;
}
/** 
 * Start the Timer running.
 * This does not {@link Timer#reset reset} the Timer!
 */
Timer.prototype.start = function() {
	this.running = true;
};
/** 
 * Stop the Timer.
 * This does not {@link Timer#reset reset} the Timer!
 */
Timer.prototype.stop = function() {
	this.running = false;
};
/**
 * Zeroes the timer.
 * This does not {@link Timer#stop stop} the Timer!
 */
Timer.prototype.reset = function() {
	this.time = 0;
};
/**
 * Advance the Timer.
 * Normally {@link Scene} does this for you.
 * @param {number} elapsedMillis How many milliseconds to advance the timer.
 */
Timer.prototype.tick = function(elapsedMillis) {
	if (!this.running) {
		return;
	}
	this.time += elapsedMillis;
	if (this.expired()) {
		this.stop();
		if (typeof this.onExpire === "function") {
			this.onExpire.call(this);
		}
		return;
	}

	if (typeof this.onTick === "function") {
		this.onTick.call(this, elapsedMillis);
	}
};
/**
 * Test if the Timer has expired.
 * @returns {boolean}
 */
Timer.prototype.expired = function() {
	return typeof this.expireMillis !== "undefined" && this.time >= this.expireMillis;
};

module.exports = Timer;
