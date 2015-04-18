"use strict";

var Keyboard = require("game-keyboard");
var keyMap = require("game-keyboard/key_map").US;
var keyboard = new Keyboard(keyMap);
var Mouse = require("./mouse");

function Input(config, canvas) {
	this.config = config;
	this.mouse = new Mouse(canvas);
}
Input.prototype.button = function(name) {
	var input = this.config[name];
	if (input === undefined) {
		console.error("No such button: " + name);
		return false;
	}
	if (input.type !== "button") {
		console.error("\"" + name + "\" is not a button");
		return false;
	}
	for (var i = 0; i < input.inputs.length; i++) {
		var physicalInput = input.inputs[i];
		var device = physicalInput.device;
		if (device === "keyboard") {
			var key = physicalInput.key;
			if (keyboard.isPressed(key)) {
				return true;
			}
		}
		if (device === "touch") {
			for (var j = 0; j < this.mouse.touches.length; j++) {
				var t = this.mouse.touches[j];
				if (t.x >= physicalInput.x && t.x < physicalInput.x + physicalInput.width && t.y >= physicalInput.y && t.y < physicalInput.y + physicalInput.height) {
					return true;
				}
			}
		}
	}
	return false;
};

module.exports = Input;
