// prevent springy scrolling on ios
document.ontouchmove = function(e) {
	e.preventDefault();
};

// prevent right-click on desktop
window.oncontextmenu = function() {
	return false;
};

function relMouseCoords(canvas, event) {
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

function Mouse(canvas) {
	this.x = 0;
	this.y = 0;
	this.buttons = [0, 0, 0];

	var that = this;
	canvas.addEventListener("mousedown", function(event) {
		var m = relMouseCoords(canvas, event);
		that.x = m.x;
		that.y = m.y;
		that.buttons[event.button] = 2;
	});
	canvas.addEventListener("mouseup", function(event) {
		var m = relMouseCoords(canvas, event);
		that.x = m.x;
		that.y = m.y;
		that.buttons[event.button] = 0;
	});
	canvas.addEventListener("touchstart", function(event) {
		var touch = event.touches[0];
		var m = relMouseCoords(canvas, touch);
		that.x = m.x;
		that.y = m.y;
		that.buttons[0] = 2;
	});
	canvas.addEventListener("touchend", function(event) {
		that.buttons[0] = 0;
	});
}
Mouse.prototype.supportsTouch = function() {
	return "ontouchstart" in window || navigator.msMaxTouchPoints;
};
Mouse.prototype.isPressed = function(button) {
	return this.buttons[button] >= 1;
};
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
