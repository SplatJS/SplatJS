var Entity = require("./entity");

function Camera(x, y, width, height) {
	Entity.call(this, x, y, width, height);
}
Camera.prototype = Object.create(Entity.prototype);
Camera.prototype.draw = function(context) {
	context.translate(-(this.x|0), -(this.y|0));
};
Camera.prototype.drawAbsolute = function(context, drawFunc) {
	context.save();
	context.translate(this.x|0, this.y|0);
	drawFunc();
	context.restore();
};

module.exports = Camera;
