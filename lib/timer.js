"use strict";

function Timer(onTick, expireMillis, onExpire) {
	this.onTick = onTick;
	this.expireMillis = expireMillis;
	this.onExpire = onExpire;
	this.running = false;
	this.time = 0;
}
Timer.prototype.start = function() {
	this.running = true;
};
Timer.prototype.stop = function() {
	this.running = false;
};
Timer.prototype.reset = function() {
	this.time = 0;
};
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
Timer.prototype.expired = function() {
	return typeof this.expireMillis !== "undefined" && this.time >= this.expireMillis;
};

module.exports = Timer;
