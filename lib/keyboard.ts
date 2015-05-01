"use strict";

class Keyboard {
	/**
	 * The current key states.
	 * @member {object}
	 * @private
	 */
	keys: { [name: string]: number } = {};
	
	/**
	 * Keyboard input handling. An instance of Keyboard is available as {@link Splat.Game#keyboard}.
	 * @constructor
	 * @param {module:KeyMap} keymap A map of keycodes to descriptive key names.
	 */
	constructor(keyMap: { [key: number]: string }) {
		for (var kc in keyMap) {
			if (keyMap.hasOwnProperty(kc)) {
				this.keys[keyMap[kc]] = 0;
			}
		}
		window.addEventListener("keydown", (event) => {
			event.preventDefault();
			if (keyMap.hasOwnProperty(event.keyCode.toString())) {
				if (this.keys[keyMap[event.keyCode]] === 0) {
					this.keys[keyMap[event.keyCode]] = 2;
				}
				return false;
			}
		});
		window.addEventListener("keyup", (event) => {
			event.preventDefault();
			if (keyMap.hasOwnProperty(event.keyCode.toString())) {
				this.keys[keyMap[event.keyCode]] = 0;
				return false;
			}
		});
	}
	
	/**
	 * Test if a key is currently pressed.
	 * @param {string} name The name of the key to test
	 * @returns {boolean}
	 */
	isPressed(name: string) {
		return this.keys[name] >= 1;
	}
	
	/**
	 * Test if a key is currently pressed, also making it look like the key was unpressed.
	 * This makes is so multiple successive calls will not return true unless the key was repressed.
	 * @param {string} name The name of the key to test
	 * @returns {boolean}
	 */
	consumePressed(name: string) {
		var p = this.keys[name] === 2;
		if (p) {
			this.keys[name] = 1;
		}
		return p;
	}
}

export = Keyboard;
