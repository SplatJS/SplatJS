var Splat = (function(splat, window, document) {

	function Entity(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.vx = 0;
		this.vy = 0;
		this.lastX = x;
		this.lastY = y;
	}
	Entity.prototype.move = function(elapsedMillis) {
		this.lastX = this.x;
		this.lastY = this.y;
		this.x += elapsedMillis * this.vx;
		this.y += elapsedMillis * this.vy;
	};
	Entity.prototype.overlapsHoriz = function(other) {
		return this.x + this.width > other.x && this.x < other.x + other.width;
	};
	Entity.prototype.overlapsVert = function(other) {
		return this.y + this.height > other.y && this.y < other.y + other.height;
	};
	Entity.prototype.collides = function(other) {
		return this.overlapsHoriz(other) && this.overlapsVert(other);
	};

	Entity.prototype.didOverlapHoriz = function(other) {
		return this.lastX + this.width > other.lastX && this.lastX < other.lastX + other.width;
	};
	Entity.prototype.didOverlapVert = function(other) {
		return this.lastY + this.height > other.lastY && this.lastY < other.lastY + other.height;
	};
	Entity.prototype.wasAbove = function(other) {
		return this.lastY + this.height <= other.lastY;
	};
	Entity.prototype.wasBelow = function(other) {
		return this.lastY >= other.lastY + other.height;
	};
	Entity.prototype.wasLeft = function(other) {
		return this.lastX + this.width <= other.lastX;
	};
	Entity.prototype.wasRight = function(other) {
		return this.lastX >= other.lastX + other.width;
	};
	Entity.prototype.moved = function() {
		var x = this.x|0;
		var lastX = this.lastX|0;
		var y = this.y|0;
		var lastY = this.lastY|0;
		return (x != lastX) || (y != lastY);
	}

	Entity.prototype.draw = function(context) {
		// draw bounding boxes
		context.strokeStyle = "#ff0000";
		context.strokeRect(this.x, this.y, this.width, this.height);
	};
	Entity.prototype.resolveCollisionWith = function(other) {
		var tolerance = 0.01;
		if (this.didOverlapHoriz(other) && this.wasAbove(other)) {
			this.y = other.y - this.height - tolerance;
		}
		if (this.didOverlapHoriz(other) && this.wasBelow(other)) {
			this.y = other.y + other.height + tolerance;
		}
		if (this.didOverlapVert(other) && this.wasLeft(other)) {
			this.x = other.x - this.width - tolerance;
		}
		if (this.didOverlapVert(other) && this.wasRight(other)) {
			this.x = other.x + other.width + tolerance;
		}
	}

	function AnimatedEntity(x, y, width, height, sprite, spriteOffsetX, spriteOffsetY) {
		this.sprite = sprite;
		this.spriteOffsetX = spriteOffsetX;
		this.spriteOffsetY = spriteOffsetY;
		Entity.call(this, x, y, width, height);
	}
	AnimatedEntity.prototype = Object.create(Entity.prototype);
	AnimatedEntity.prototype.move = function(elapsedMillis) {
		Entity.prototype.move.call(this, elapsedMillis);
		if (typeof this.sprite.move === "function") {
			this.sprite.move(elapsedMillis);
		}
	};
	AnimatedEntity.prototype.draw = function(context) {
		if (typeof this.sprite.draw === "function") {
			this.sprite.draw(context, this.x + this.spriteOffsetX, this.y + this.spriteOffsetY);
		} else {
			context.drawImage(this.sprite, this.x + this.spriteOffsetX, this.y + this.spriteOffsetY);
		}
		// draw bounding boxes
		context.strokeStyle = "#ff0000";
		context.strokeRect(this.x, this.y, this.width, this.height);
	};
	AnimatedEntity.prototype.copy = function() {
		return new AnimatedEntity(this.x, this.y, this.width, this.height, this.sprite, this.spriteOffsetX, this.spriteOffsetY);
	};

	splat.Entity = Entity;
	splat.AnimatedEntity = AnimatedEntity;
	return splat;

}(Splat || {}, window, document));
