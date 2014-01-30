var Splat = (function(splat, window) {

	function KeyboardInput(keyMap) {
		this.keys = {};

		var that = this;
		for (var kc in keyMap) {
			this.keys[keyMap[kc]] = 0;
		}
		window.addEventListener("keydown", function(event) {
			if (keyMap.hasOwnProperty(event.keyCode)) {
				if (that.keys[keyMap[event.keyCode]] === 0) {
					that.keys[keyMap[event.keyCode]] = 1;
				}
				return false;
			}
		});
		window.addEventListener("keyup", function(event) {
			if (keyMap.hasOwnProperty(event.keyCode)) {
				that.keys[keyMap[event.keyCode]] = 0;
				return false;
			}
		});
	}
	KeyboardInput.prototype.isPressed = function(name) {
		return this.keys[name] == 1;
	};
	KeyboardInput.prototype.consumePressed = function(name) {
		var p = this.isPressed(name);
		if (p) {
			this.keys[name] = -1;
		}
		return p;
	};

	splat.keyMap = {
		"US": {
			27: "escape",
			32: "space",
			37: "left",
			38: "up",
			39: "right",
			40: "down",
			77: "m"
		}
	};
	splat.KeyboardInput = KeyboardInput;
	return splat;

}(Splat || {}, window));
