var Splat = (function(splat, window, document) {

	function Camera(x, y, width, height) {
		splat.Entity.call(this, x, y, width, height);
	}
	Camera.prototype = Object.create(splat.Entity.prototype);
	Camera.prototype.draw = function(context) {
		context.translate(-(this.x|0), -(this.y|0));
	};
	Camera.prototype.drawAbsolute = function(context, drawFunc) {
		context.save();
		context.translate(this.x|0, this.y|0);
		drawFunc();
		context.restore();
	};

	function EntityBoxCamera(entity, width, height, screenCenterX, screenCenterY) {
		this.entity = entity;
		this.screenCenterX = screenCenterX;
		this.screenCenterY = screenCenterY;

		var x = keepPositionInBox(entity.x, entity.width, 0, width, screenCenterX);
		var y = keepPositionInBox(entity.y, entity.height, 0, height, screenCenterY);
		Camera.call(this, x, y, width, height);
	}
	EntityBoxCamera.prototype = Object.create(Camera.prototype);
	EntityBoxCamera.prototype.move = function(elapsedMillis) {
		this.x = keepPositionInBox(this.entity.x, this.entity.width, this.x, this.width, this.screenCenterX);
		this.y = keepPositionInBox(this.entity.y, this.entity.height, this.y, this.height, this.screenCenterY);
	};
	function keepPositionInBox(entityPos, entitySize, thisPos, thisSize, offset) {
		var boundsFromCenter = thisSize / 2;
		if (entityPos < thisPos + offset - boundsFromCenter) {
			thisPos = entityPos - offset + boundsFromCenter;
		}
		if (entityPos + entitySize > thisPos + offset + boundsFromCenter) {
			thisPos = entityPos + entitySize - offset - boundsFromCenter;
		}
		return thisPos;
	}


	splat.Camera = Camera;
	splat.EntityBoxCamera = EntityBoxCamera;
	return splat;

}(Splat || {}, window, document));
