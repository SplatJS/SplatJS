var buffer = require("./buffer");

function Animation() {
	this.frames = [];
	this.frame = 0;
	this.elapsedMillis = 0;
	this.repeatAt = 0;
	this.width = 0;
	this.height = 0;
}
Animation.prototype.add = function(img, time) {
	this.frames.push({img: img, time: time});
	if (this.frames.length === 1) {
		this.width = img.width;
		this.height = img.height;
	}
};
Animation.prototype.step = function() {
	this.frame++;
	if (this.frame >= this.frames.length) {
		this.frame = this.repeatAt;
	}
};
Animation.prototype.move = function(elapsedMillis) {
	this.elapsedMillis += elapsedMillis;
	while (this.elapsedMillis > this.frames[this.frame].time) {
		this.elapsedMillis -= this.frames[this.frame].time;
		this.step();
	}
};
Animation.prototype.draw = function(context, x, y) {
	var img = this.frames[this.frame].img;
	context.drawImage(img, x, y);
};
Animation.prototype.reset = function() {
	this.frame = 0;
	this.elapsedMillis = 0;
};
Animation.prototype.flipHorizontally = function() {
	for (var i = 0; i < this.frames.length; i++) {
		this.frames[i].img = buffer.flipBufferHorizontally(this.frames[i].img);
	}
};
Animation.prototype.flipVertically = function() {
	for (var i = 0; i < this.frames.length; i++) {
		this.frames[i].img = buffer.flipBufferVertically(this.frames[i].img);
	}
};

module.exports = Animation;
