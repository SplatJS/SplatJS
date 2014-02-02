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

	function flipBufferHorizontally(buffer) {
		return makeBuffer(buffer.width, buffer.height, function(context) {
			context.scale(-1, 1);
			context.drawImage(buffer, -buffer.width, 0);
		});
	}

	function flipBufferVertically(buffer) {
		return makeBuffer(buffer.width, buffer.height, function(context) {
			context.scale(1, -1);
			context.drawImage(buffer, 0, -buffer.height);
		});
	}
	splat.makeBuffer = makeBuffer;
	splat.flipBufferHorizontally = flipBufferHorizontally;
	splat.flipBufferVertically = flipBufferVertically;
	return splat;

}(Splat || {}, window, document));
