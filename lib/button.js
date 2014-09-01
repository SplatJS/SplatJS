"use strict";

var Animation = require("./animation");

function Button(mouse, x, y, sprites, stateChanged) {
	this.mouse = mouse;
	this.x = x;
	this.y = y;
	this.state = "normal";
	this.stateChanged = stateChanged;
	this.isToggle = false;

	if (!sprites.normal && sprites.pressDown instanceof Animation) {
		sprites.normal = sprites.pressDown.frames[0].img;
	}
	if (!sprites.pressed && sprites.pressDown instanceof Animation) {
		sprites.pressed = sprites.pressDown.frames[sprites.pressDown.frames.length - 1].img;
	}
	this.sprites = sprites; // normal, pressed, pressDown, popUp
	if (!sprites.normal) {
		console.error("Button is missing the required \"normal\" sprite");
	}
	if (!sprites.pressed) {
		console.error("Button is missing the required \"pressed\" sprite");
	}

	this.width = sprites.normal.width;
	this.height = sprites.normal.height;
}
Button.prototype.move = function(elapsedMillis) {
	var self = this;
	function changeState(state) {
		self.state = state;
		self.stateChanged(state);
		if (self.sprites[state] instanceof Animation) {
			self.sprites[state].reset();
		}
	}

	if (this.state === "normal" && this.mouse.consumePressed(0, this.x, this.y, this.width, this.height)) {
		changeState("pressDown");
		if (!this.sprites.pressDown) {
			changeState("pressed");
		}
	}
	if (this.state === "pressDown" && this.sprites.pressDown.frame === this.sprites.pressDown.frames.length - 1) {
		changeState("pressed");
	}
	if (this.state === "pressed" && (this.isToggle ? this.mouse.consumePressed(0, this.x, this.y, this.width, this.height) : !this.mouse.isPressed(0))) {
		changeState("popUp");
		if (!this.sprites.popUp) {
			changeState("normal");
		}
	}
	if (this.state === "popUp" && this.sprites.popUp.frame === this.sprites.popUp.frames.length - 1) {
		changeState("normal");
	}

	var sprite = this.sprites[this.state];
	if (typeof sprite.move === "function") {
		sprite.move(elapsedMillis);
	}
};
Button.prototype.draw = function(context) {
	var sprite = this.sprites[this.state];
	if (typeof sprite.draw === "function") {
		sprite.draw(context, this.x, this.y);
	} else {
		context.drawImage(sprite, this.x, this.y);
	}
};

module.exports = Button;
