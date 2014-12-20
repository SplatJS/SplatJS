"use strict";

var spatialHash = {};

var gridSize = 100;

function toGrid(i) {
	return Math.floor(i / gridSize);
}
function keys(entity) {
	var x1 = toGrid(entity.position.x);
	var x2 = toGrid(entity.position.x + entity.size.width);

	var y1 = toGrid(entity.position.y);
	var y2 = toGrid(entity.position.y + entity.size.height);

	var k = [];
	for (var x = x1; x <= x2; x++) {
		for (var y = y1; y <= y2; y++) {
			k.push(x + "," + y);
		}
	}
	return k;
}

function add(entity, key) {
	if (!spatialHash[key]) {
		spatialHash[key] = [];
	}
	spatialHash[key].forEach(function(peer) {
		if (entity.collisions.indexOf(peer.id) !== -1) {
			return;
		}
		if (collides(entity, peer)) {
			entity.collisions.push(peer.id);
			peer.collisions.push(entity.id);
		}
	});
	spatialHash[key].push(entity);
}

function collides(a, b) {
	return a.position.x + a.size.width > b.position.x &&
		a.position.x < b.position.x + b.size.width &&
		a.position.y + a.size.height > b.position.y &&
		a.position.y < b.position.y + b.size.height;
}

module.exports = function(ecs) {
	ecs.add(function(entities, elapsed) { // jshint ignore:line
		spatialHash = {};
	});
	ecs.addEach(function(entity, elapsed) { // jshint ignore:line
		entity.collisions = []; // Maybe we should just empty the array instead of allocating a new one?
		keys(entity).forEach(add.bind(undefined, entity));
	}, ["position", "size", "collisions"]);
};
