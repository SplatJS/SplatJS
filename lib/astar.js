"use strict";

var BinaryHeap = require("./binary_heap");

function AStar(isWalkable) {
	this.destX = 0;
	this.destY = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.openNodes = {};
	this.closedNodes = {};
	this.openHeap = new BinaryHeap(function(a, b) {
		return a.f - b.f;
	});
	this.isWalkable = isWalkable;
}
AStar.prototype.heuristic = function(x, y) {
	// manhattan method
	var dx = Math.abs(x - this.destX) / this.scaleX;
	var dy = Math.abs(y - this.destY) / this.scaleY;
	return dx + dy;
};
AStar.prototype.makeNode = function(x, y, parent, g) {
	g += parent.g;
	var h = this.heuristic(x, y);

	return {
		x: x,
		y: y,
		parent: parent,
		f: g + h,
		g: parent.g + g,
		h: h
	};
};
AStar.prototype.updateOpenNode = function(key, parent, g) {
	var node = this.openNodes[key];
	if (!node) {
		return false;
	}

	var newG = parent.g + g;

	if (newG >= node.g) {
		return true;
	}

	node.parent = parent;
	node.g = newG;
	node.f = node.g + node.h;

	var pos = this.openHeap.indexOf(node);
	this.openHeap.bubbleUp(pos);

	return true;
};
AStar.prototype.insertNeighbor = function(key, x, y, parent, g) {
	var node = this.makeNode(x, y, parent, g);
	this.openNodes[key] = node;
	this.openHeap.insert(node);
};
AStar.prototype.tryNeighbor = function(x, y, parent, g) {
	var key = makeKey(x, y);
	if (this.closedNodes[key]) {
		return;
	}
	if (!this.isWalkable(x, y)) {
		return;
	}
	if (!this.updateOpenNode(key, parent, g)) {
		this.insertNeighbor(key, x, y, parent, g);
	}
};
AStar.prototype.getNeighbors = function getNeighbors(parent) {
	var diagonalCost = 1.4;
	var straightCost = 1;
	this.tryNeighbor(parent.x - this.scaleX, parent.y - this.scaleY, parent, diagonalCost);
	this.tryNeighbor(parent.x, parent.y - this.scaleY, parent, straightCost);
	this.tryNeighbor(parent.x + this.scaleX, parent.y - this.scaleY, parent, diagonalCost);

	this.tryNeighbor(parent.x - this.scaleX, parent.y, parent, straightCost);
	this.tryNeighbor(parent.x + this.scaleX, parent.y, parent, straightCost);

	this.tryNeighbor(parent.x - this.scaleX, parent.y + this.scaleY, parent, diagonalCost);
	this.tryNeighbor(parent.x, parent.y + this.scaleY, parent, straightCost);
	this.tryNeighbor(parent.x + this.scaleX, parent.y + this.scaleY, parent, diagonalCost);
};

function generatePath(node) {
	var path = [];
	while (node.parent) {
		var ix = node.x;
		var iy = node.y;
		while (ix !== node.parent.x || iy !== node.parent.y) {
			path.unshift({x: ix, y: iy});

			var dx = node.parent.x - ix;
			if (dx > 0) {
				ix++;
			} else if (dx < 0) {
				ix--;
			}
			var dy = node.parent.y - iy;
			if (dy > 0) {
				iy++;
			} else if (dy < 0) {
				iy--;
			}
		}
		node = node.parent;
	}
	return path;
}

function makeKey(x, y) {
	return x + "," + y;
}

AStar.prototype.search = function aStar(srcX, srcY, destX, destY) {
	function scale(c, s) {
		var downscaled = (c / s) |0;
		return downscaled * s;
	}
	srcX = scale(srcX, this.scaleX);
	srcY = scale(srcY, this.scaleY);
	this.destX = scale(destX, this.scaleX);
	this.destY = scale(destY, this.scaleY);

	if (!this.isWalkable(this.destX, this.destY)) {
		return [];
	}

	var srcKey = makeKey(srcX, srcY);
	var srcNode = {
		x: srcX,
		y: srcY,
		g: 0,
		h: this.heuristic(srcX, srcY)
	};
	srcNode.f = srcNode.h;
	this.openNodes = {};
	this.openNodes[srcKey]  = srcNode;
	this.openHeap = new BinaryHeap(function(a, b) {
		return a.f - b.f;
	});
	this.openHeap.insert(srcNode);
	this.closedNodes = {};

	var node = this.openHeap.deleteRoot();
	while (node) {
		var key = makeKey(node.x, node.y);
		delete this.openNodes[key];
		this.closedNodes[key] = node;
		if (node.x === this.destX && node.y === this.destY) {
			return generatePath(node);
		}
		this.getNeighbors(node);
		node = this.openHeap.deleteRoot();
	}
	return [];
};

module.exports = AStar;
