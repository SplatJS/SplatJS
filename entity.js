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
		// context.strokeStyle = "#ff0000";
		// context.strokeRect(this.x, this.y, this.width, this.height);
	};
	AnimatedEntity.prototype.copy = function() {
		return new AnimatedEntity(this.x, this.y, this.width, this.height, this.sprite, this.spriteOffsetX, this.spriteOffsetY);
	};

	splat.Entity = Entity;
	splat.AnimatedEntity = AnimatedEntity;
	return splat;

}(Splat || {}, window, document));
