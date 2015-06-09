"use strict";

class Timer {
	/**
	 * Called when the Timer is {@link Splat.Timer#tick tick()}ed
	 * @member {tickCallback}
	 * @private
	 */
	onTick: (elapsedMillis: number) => void;
	/**
	 * The number of milliseconds until the Timer expires.
	 * When {@link Splat.Timer#time} reaches this number, the Timer will be expired, and {@link Splat.Timer#onExpire} will be called.
	 * @member {number}
	 * @private
	 */
	expireMillis: number;
	/**
	 * Called when the Timer expires.
	 * @member {expireCallback}
	 * @private
	 */
	onExpire: () => void;
	/**
	 * Whether or not the Timer is currently running.
	 * @member {boolean}
	 * @private
	 */
	running = false;
	/**
	 * How long the Timer has run in milliseconds.
	 * @member {number}
	 * @private
	 */
	time = 0;
	
	/**
	 * A timer that calls callbacks while it is running, and when it expires.
	 * @constructor
	 * @alias Splat.Timer
	 * @param {simulationCallback} onTick Called when the Timer is {@link Splat.Timer#tick tick()}ed
	 * @param {number} expireMillis The number of milliseconds until the Timer expires
	 * @param {emptyCallback} onExpire Called when the Timer expires
	 */
	constructor(onTick: (elapsedMillis: number) => void, expireMillis: number, onExpire: () => void) {
		this.onTick = onTick;
		this.expireMillis = expireMillis;
		this.onExpire = onExpire;
	}
	
	/** 
	 * Start the Timer running.
	 * This does not {@link Splat.Timer#reset reset} the Timer!
	 */
	start() {
		this.running = true;
	}
	
	/** 
	 * Stop the Timer.
	 * This does not {@link Splat.Timer#reset reset} the Timer!
	 */
	stop() {
		this.running = false;
	}
	
	/**
	 * Zeroes the timer.
	 * This does not {@link Splat.Timer#stop stop} the Timer!
	 */
	reset() {
		this.time = 0;
	}
	
	/**
	 * Advance the Timer.
	 * Normally {@link Splat.Scene} does this for you.
	 * @param {number} elapsedMillis How many milliseconds to advance the timer.
	 */
	tick(elapsedMillis: number) {
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
	}
	
	/**
	 * Test if the Timer has expired.
	 * @returns {boolean}
	 */
	expired() {
		return typeof this.expireMillis !== "undefined" && this.time >= this.expireMillis;
	}
}

export = Timer;
