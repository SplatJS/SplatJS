"use strict";

/**
 * Keyboard input handling. An instance of Keyboard is available as {@link Splat.Game#keyboard}.
 * @constructor
 * @param {module:KeyMap} keymap A map of keycodes to descriptive key names.
 */
function Keyboard(keyMap) {
	/**
	 * The current key states.
	 * @member {object}
	 * @private
	 */
	this.keys = {};

	var self = this;
	for (var kc in keyMap) {
		if (keyMap.hasOwnProperty(kc)) {
			this.keys[keyMap[kc]] = 0;
		}
	}
	window.addEventListener("keydown", function(event) {
		event.preventDefault();
		if (keyMap.hasOwnProperty(event.keyCode)) {
			if (self.keys[keyMap[event.keyCode]] === 0) {
				self.keys[keyMap[event.keyCode]] = 2;
			}
			return false;
		}
	});
	window.addEventListener("keyup", function(event) {
		event.preventDefault();
		if (keyMap.hasOwnProperty(event.keyCode)) {
			self.keys[keyMap[event.keyCode]] = 0;
			return false;
		}
	});
}
/**
 * Test if a key is currently pressed.
 * @param {string} name The name of the key to test
 * @returns {boolean}
 */
Keyboard.prototype.isPressed = function(name) {
	return this.keys[name] >= 1;
};
/**
 * Test if a key is currently pressed, also making it look like the key was unpressed.
 * This makes is so multiple successive calls will not return true unless the key was repressed.
 * @param {string} name The name of the key to test
 * @returns {boolean}
 */
Keyboard.prototype.consumePressed = function(name) {
	var p = this.keys[name] === 2;
	if (p) {
		this.keys[name] = 1;
	}
	return p;
};

module.exports = Keyboard;
