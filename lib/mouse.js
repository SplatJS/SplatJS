"use strict";

// prevent springy scrolling on ios
document.ontouchmove = function(e) {
	e.preventDefault();
};

// prevent right-click on desktop
window.oncontextmenu = function() {
	return false;
};

var relMouseCoords = function(canvas, event) {
	var x = event.pageX - canvas.offsetLeft + document.body.scrollLeft;
	var y = event.pageY - canvas.offsetTop + document.body.scrollTop;

	// scale based on ratio of canvas internal dimentions to css dimensions
	if (canvas.style.width.length) {
		x *= canvas.width / canvas.style.width.substring(0, canvas.style.width.indexOf("p"));
	}
	if (canvas.style.height.length) {
		y *= canvas.height / canvas.style.height.substring(0, canvas.style.height.indexOf("p"));
	}

	return {x:x, y:y};
};

function relMouseCoordsEjecta() {
	var event = arguments[1];
	var x = event.pageX * window.devicePixelRatio;
	var y = event.pageY * window.devicePixelRatio;
	return {x:x, y:y};
}

if (window.ejecta) {
	relMouseCoords = relMouseCoordsEjecta;
}

/**
 * Mouse and touch input handling. This is typically set up for you by {@link Game}.
 * @constructor
 * @param {external:canvas} canvas The canvas to listen for events on.
 */
function Mouse(canvas) {
	/**
	 * The x coordinate of the cursor relative to the left side of the canvas.
	 * @member {number}
	 */
	this.x = 0;
	/**
	 * The y coordinate of the cursor relative to the top of the canvas.
	 * @member {number}
	 */
	this.y = 0;
	/**
	 * The current button states.
	 * @member {Array}
	 * @private
	 */
	this.buttons = [0, 0, 0];

	var self = this;
	canvas.addEventListener("mousedown", function(event) {
		var m = relMouseCoords(canvas, event);
		self.x = m.x;
		self.y = m.y;
		self.buttons[event.button] = 2;
	});
	canvas.addEventListener("mouseup", function(event) {
		var m = relMouseCoords(canvas, event);
		self.x = m.x;
		self.y = m.y;
		self.buttons[event.button] = 0;
	});
	canvas.addEventListener("touchstart", function(event) {
		var touch = event.touches[0];
		var m = relMouseCoords(canvas, touch);
		self.x = m.x;
		self.y = m.y;
		self.buttons[0] = 2;
	});
	canvas.addEventListener("touchend", function() {
		self.buttons[0] = 0;
	});
}
/**
 * Test whether the device supports touch events. This is useful to customize messages to say either "click" or "tap".
 * @returns boolean
 */
Mouse.prototype.supportsTouch = function() {
	return "ontouchstart" in window || navigator.msMaxTouchPoints;
};
/**
 * Test if a mouse button is currently pressed.
 * @param {number} button The button number to test. Button 0 is typically the left mouse button, as well as the first touch location.
 * @returns {boolean}
 */
Mouse.prototype.isPressed = function(button) {
	return this.buttons[button] >= 1;
};
/**
 * Test if a mouse button is currently pressed, and was newly pressed down since the last call to consumePressed.
 * @param {number} button The button number to test.
 * @param {number} [x] The left edge of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
 * @param {number} [y] The top edge of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
 * @param {number} [width] The width of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
 * @param {number} [height] The height of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
 */
Mouse.prototype.consumePressed = function(button, x, y, width, height) {
	var b = this.buttons[button] === 2;
	if (arguments.length > 1 && (this.x < x || this.x > x + width || this.y < y || this.y > y + height)) {
		b = false;
	}
	if (b) {
		this.buttons[button] = 1;
	}
	return b;
};

module.exports = Mouse;
