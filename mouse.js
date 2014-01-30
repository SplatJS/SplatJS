var Splat = (function(splat, window, document) {

	function MouseInput(canvas) {
		var relMouseCoords = function(event) {
			var x = event.pageX - canvas.offsetLeft + document.body.scrollLeft;
			var y = event.pageY - canvas.offsetTop + document.body.scrollTop;

			// scale based on ratio of canvas internal dimentions to css dimensions
			x *= canvas.width / canvas.style.width.substring(0, canvas.style.width.indexOf("p"));
			y *= canvas.height / canvas.style.height.substring(0, canvas.style.height.indexOf("p"));

			return {x:x, y:y};
		};

		this.x = 0;
		this.y = 0;
		this.buttons = [false, false, false];

		// prevent springy scrolling on ios
		document.ontouchmove = function(e) {
			e.preventDefault();
		};

		// prevent right-click on desktop
		window.oncontextmenu = function() {
			return false;
		};

		var that = this;
		canvas.addEventListener("mousedown", function(event) {
			var m = relMouseCoords(event);
			that.x = m.x;
			that.y = m.y;
			that.buttons[event.button] = true;
		});
		canvas.addEventListener("mouseup", function(event) {
			var m = relMouseCoords(event);
			that.x = m.x;
			that.y = m.y;
			that.buttons[event.button] = false;
		});
		canvas.addEventListener("touchstart", function(event) {
			var touch = event.touches[0];
			var m = relMouseCoords(touch);
			that.x = m.x;
			that.y = m.y;
			that.buttons[0] = true;
		});
		canvas.addEventListener("touchend", function(event) {
			that.buttons[0] = false;
		});
	}
	MouseInput.prototype.supportsTouch = function() {
		return "ontouchstart" in window || navigator.msMaxTouchPoints;
	};

	splat.MouseInput = MouseInput;
	return splat;

}(Splat || {}, window, document));
