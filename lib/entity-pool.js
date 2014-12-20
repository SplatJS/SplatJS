"use strict";

function EntityPool() {
	this.nextId = 0;
	this.entities = {};
}
EntityPool.prototype.add = function() {
	var id = this.nextId;
	this.nextId++;
	var entity = { id: id };
	this.entities[id] = entity;
	return entity;
};

module.exports = EntityPool;
