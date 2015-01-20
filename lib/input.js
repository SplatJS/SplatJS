"use strict";

var Keyboard = require("game-keyboard");
var keyMap = require("game-keyboard/key_map").US;
var keyboard = new Keyboard(keyMap);

function Input(config) {
	this.config = config;
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
		var source = physicalInput[0];
		var button = physicalInput[1];
		if (source === "keyboard") {
			if (keyboard.isPressed(button)) {
				return true;
			}
		}
	}
	return false;
};

module.exports = Input;
