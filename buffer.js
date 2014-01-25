var Splat = (function(splat, window, document) {

	function makeCanvas(width, height) {
		var c = document.createElement("canvas");
		c.width = width;
		c.height = height;
		return c;
	}

	function makeBuffer(width, height, drawFun) {
		var canvas = makeCanvas(width, height);
		var ctx = canvas.getContext("2d");
		drawFun(ctx);
		return canvas;
	}

	splat.makeBuffer = makeBuffer;
	return splat;

}(Splat || {}, window, document));
