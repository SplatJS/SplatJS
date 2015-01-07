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
EntityPool.prototype.save = function() {
	return objectValues(this.entities);
};
EntityPool.prototype.load = function(data) {
	this.entities = data.reduce(function(entities, entity) {
		entities[entity.id] = entity;
		if (this.nextId <= entity.id) {
			this.nextId = entity.id + 1;
		}
		return entities;
	}.bind(this), this.entities);
};

function objectValues(obj) {
	return Object.keys(obj).map(function(key) {
		return obj[key];
	});
}

module.exports = EntityPool;
