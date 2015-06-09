"use strict";

import Animation = require("./animation");

class Button {
	mouse: any;
	x: number;
	y: number;
	sprites: any;
	stateChanged: (state: string) => {};
	width: number;
	height: number;
	state = "normal";
	isToggle = false;
	
	constructor(mouse: any, x: number, y: number, sprites: any, stateChanged: (state: string) => {}) {
		this.mouse = mouse;
		this.x = x;
		this.y = y;
		this.stateChanged = stateChanged;
	
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
	
	move(elapsedMillis: number) {
		var changeState = (state: string) => {
			this.state = state;
			this.stateChanged(state);
			if (this.sprites[state] instanceof Animation) {
				this.sprites[state].reset();
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
	}
	
	draw(context: CanvasRenderingContext2D) {
		var sprite = this.sprites[this.state];
		if (typeof sprite.draw === "function") {
			sprite.draw(context, this.x, this.y);
		} else {
			context.drawImage(sprite, this.x, this.y);
		}
	}
}

export = Button;
