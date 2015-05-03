"use strict";

import platform = require("./platform");

interface TouchInfo {
	x: number;
	y: number;
	id?: number | string;
	isMouse?: boolean;
	consumed?: boolean;
}

// prevent springy scrolling on ios
document.ontouchmove = function(e) {
	e.preventDefault();
};

// prevent right-click on desktop
window.oncontextmenu = function() {
	return false;
};

var relMouseCoords = function(canvas: HTMLCanvasElement, event: MouseEvent | Touch): TouchInfo {
	var x = event.pageX - canvas.offsetLeft + document.body.scrollLeft;
	var y = event.pageY - canvas.offsetTop + document.body.scrollTop;

	// scale based on ratio of canvas internal dimentions to css dimensions
	if (canvas.style.width.length) {
		x *= canvas.width / parseFloat(canvas.style.width);
	}
	if (canvas.style.height.length) {
		y *= canvas.height / parseFloat(canvas.style.height);
	}

	return {x:x, y:y};
};

function relMouseCoordsEjecta(canvas: HTMLCanvasElement, event: MouseEvent | Touch): TouchInfo {
	var ratioX = canvas.width / window.innerWidth;
	var ratioY = canvas.height / window.innerHeight;
	var x = event.pageX * ratioX;
	var y = event.pageY * ratioY;
	return {x:x, y:y};
}

if (platform.isEjecta()) {
	relMouseCoords = relMouseCoordsEjecta;
}

class Mouse {
	/**
	 * The x coordinate of the cursor relative to the left side of the canvas.
	 * @member {number}
	 */
	x = 0;
	/**
	 * The y coordinate of the cursor relative to the top of the canvas.
	 * @member {number}
	 */
	y = 0;
	/**
	 * The current button states.
	 * @member {Array}
	 * @private
	 */
	private buttons = [0, 0, 0];

	/**
	 * An array of the current touches on a touch screen device. Each touch has a `x`, `y`, and `id` field.
	 * @member {Array}
	 */
	touches: TouchInfo[] = [];
	
	/**
	 * A function that is called when a mouse button or touch is released.
	 * @callback onmouseupHandler
	 * @param {number} x The x coordinate of the mouse or touch that was released.
	 * @param {number} y The y coordinate of the mouse or touch that was released.
	 */
	/**
	 * A function that will be called when a mouse button is released, or a touch has stopped.
	 * This is useful for opening a URL with {@link Splat.openUrl} to avoid popup blockers.
	 * @member {onmouseupHandler}
	 */
	onmouseup: (x: number, y: number) => void = undefined;
		
	/**
	 * Mouse and touch input handling. An instance of Mouse is available as {@link Splat.Game#mouse}.
	 *
	 * The first touch will emulates a mouse press with button 0.
	 * This means you can use the mouse ({@link Mouse#isPressed}/{@link Mouse#consumePressed}) APIs and your game will work on touch screens (as long as you only need the left button.
	 *
	 * A mouse press will emulate a touch if the device does not support touch.
	 * This means you can use {@link Mouse#touches}, and your game will still work on a PC with a mouse.
	 * Also, if you call {@link Mouse#consumePressed} with button 0, it will add a `consumed:true` field to all current touches. This will help you prevent processing a touch multiple times.
	 *
	 * @constructor
	 * @param {external:canvas} canvas The canvas to listen for events on.
	 */
	constructor(canvas: HTMLCanvasElement) {
		canvas.addEventListener("mousedown", (event: MouseEvent) => {
			var m = relMouseCoords(canvas, event);
			this.x = m.x;
			this.y = m.y;
			this.buttons[event.button] = 2;
			this.updateTouchFromMouse();
		});
		canvas.addEventListener("mouseup", (event: MouseEvent) => {
			var m = relMouseCoords(canvas, event);
			this.x = m.x;
			this.y = m.y;
			this.buttons[event.button] = 0;
			this.updateTouchFromMouse();
			if (this.onmouseup) {
				this.onmouseup(this.x, this.y);
			}
		});
		canvas.addEventListener("mousemove", (event: MouseEvent) => {
			var m = relMouseCoords(canvas, event);
			this.x = m.x;
			this.y = m.y;
			this.updateTouchFromMouse();
		});

		function eachChangedTouch(event: TouchEvent, onChangeFunc: (touch: Touch) => void) {
			var touches = event.changedTouches;
			for (var i = 0; i < touches.length; i++) {
				onChangeFunc(touches[i]);
			}
		}
		canvas.addEventListener("touchstart", (event: TouchEvent) => {
			eachChangedTouch(event, (touch) => {
				var t = relMouseCoords(canvas, touch);
				t.id = touch.identifier;
				if (this.touches.length === 0) {
					t.isMouse = true;
					this.updateMouseFromTouch(t);
				}
				this.touches.push(t);
			});
		});
		canvas.addEventListener("touchmove", (event: TouchEvent) => {
			eachChangedTouch(event, (touch) => {
				var idx = this.touchIndexById(touch.identifier);
				var t = this.touches[idx];
				var coords = relMouseCoords(canvas, touch);
				t.x = coords.x;
				t.y = coords.y;
				if (t.isMouse) {
					this.updateMouseFromTouch(t);
				}
			});
		});
		canvas.addEventListener("touchend", (event: TouchEvent) => {
			eachChangedTouch(event, (touch) => {
				var idx = this.touchIndexById(touch.identifier);
				var t = this.touches.splice(idx, 1)[0];
				if (t.isMouse) {
					if (this.touches.length === 0) {
						this.buttons[0] = 0;
					} else {
						this.touches[0].isMouse = true;
						this.updateMouseFromTouch(this.touches[0]);
					}
				}
				if (this.onmouseup) {
					this.onmouseup(t.x, t.y);
				}
			});
		});
	}
	
	private updateTouchFromMouse() {
		if (this.supportsTouch()) {
			return;
		}
		var idx = this.touchIndexById("mouse");
		if (this.isPressed(0)) {
			if (idx !== undefined) {
				var touch = this.touches[idx];
				touch.x = this.x;
				touch.y = this.y;
			} else {
				this.touches.push({
					id: "mouse",
					x: this.x,
					y: this.y
				});
			}
		} else if (idx !== undefined) {
			this.touches.splice(idx, 1);
		}
	}
	
	private updateMouseFromTouch(touch: TouchInfo) {
		this.x = touch.x;
		this.y = touch.y;
		if (this.buttons[0] === 0) {
			this.buttons[0] = 2;
		}
	}
	
	private touchIndexById(id: number | string) {
		for (var i = 0; i < this.touches.length; i++) {
			if (this.touches[i].id === id) {
				return i;
			}
		}
		return undefined;
	}
	
	/**
	 * Test whether the device supports touch events. This is useful to customize messages to say either "click" or "tap".
	 * @returns {boolean}
	 */
	supportsTouch() {
		return "ontouchstart" in window || navigator.msMaxTouchPoints;
	}
	
	/**
	 * Test if a mouse button is currently pressed.
	 * @param {number} button The button number to test. Button 0 is typically the left mouse button, as well as the first touch location.
	 * @param {number} [x] The left edge of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
	 * @param {number} [y] The top edge of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
	 * @param {number} [width] The width of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
	 * @param {number} [height] The height of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
	 * @returns {boolean}
	 */
	isPressed(button: number, x?: number, y?: number, width?: number, height?: number) {
		var b = this.buttons[button] >= 1;
		if (arguments.length > 1 && (this.x < x || this.x > x + width || this.y < y || this.y > y + height)) {
			b = false;
		}
		return b;
	}
	
	/**
	 * Test if a mouse button is currently pressed, and was newly pressed down since the last call to consumePressed.
	 * If you call this with button 0, it will add a `consumed:true` field to all current touches. This will help you prevent processing a touch multiple times.
	 * @param {number} button The button number to test.
	 * @param {number} [x] The left edge of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
	 * @param {number} [y] The top edge of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
	 * @param {number} [width] The width of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
	 * @param {number} [height] The height of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
	 * @returns {boolean}
	 */
	consumePressed(button: number, x?: number, y?: number, width?: number, height?: number) {
		var b = this.buttons[button] === 2;
		if (arguments.length > 1 && (this.x < x || this.x > x + width || this.y < y || this.y > y + height)) {
			b = false;
		}
		if (b) {
			this.buttons[button] = 1;
			if (button === 0) {
				for (var i = 0; i < this.touches.length; i++) {
					this.touches[i].consumed = true;
				}
			}
		}
		return b;
	}
}

export = Mouse;
